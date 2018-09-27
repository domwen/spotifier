const express = require('express');
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require('compression');

const db = require('./db');
const { hashPass, checkPass } = require('./src/hash');
// const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const s3 = require('./s3.js');
const config = require('./config.json');
// const querystring = require('querystring');
const {getToken, getResults, prepareQueriesForAPI, filterResults} = require("./modules.js");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {gmail_user, gmail_pass} = require("./secrets.json");







// =============== BOILERPLATE STUFF STARTS HERE ===========

//==================== IMAGE UPLOADER BOILERPLATE CODE ===========
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//=========== END OF IMAGE UPLOADER BOILERPLATE =============
app.use(compression());

app.use(require('body-parser').json());

const cookieSessionMiddleware = cookieSession({
    secret: `Döner Kebap`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

// io.use(function(socket, next) {
//     cookieSessionMiddleware(socket.request, socket.request.res, next);
// });

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static('./public'));

// =============== BOILERPLATE STUFF ENDS HERE ===========

app.get('/welcome', function(req, res) {
    // console.log('req: ', req);
    if (req.session.userId) {
        // if logged in, redirect to root
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', (req, res) => {
    let { first, last, email, pass } = req.body;

    hashPass(pass)
        .then(hashedSaltedPw => {
            console.log('hashedSaltedPw', hashedSaltedPw);
            const params = [
                first || null,
                last || null,
                email || null,
                hashedSaltedPw || null
            ];
            db.saveUser(params).then(results => {
                // console.log('userId :', userId);
                req.session.userId = results.rows[0].id;
                // console.log('req.session :', req.session);
                res.json({ success: true });
            });
        })
        .catch(err => {
            console.log('There was an error: ', err);
            res.render('error', {
                layout: 'main',
                error: true
            });
        });
});

app.post('/login', (req, res) => {
    let { email, pass } = req.body;
    console.log("let { email, pass } = req.body; :", email, pass);
    db.getPassword(email)
        .then(results => {
            console.log(' Results from  getPassword', results.rows[0]);
            let user = results.rows[0];
            var storedPw = results.rows[0].password;
            var userId = results.rows[0].id;
            checkPass(pass, storedPw).then(result => {
                if (result) {
                    req.session = {
                        userId: userId,
                        user: {
                            first: user.first,
                            last: user.last,
                            url: user.profile_pic_url

                        }
                    };

                    console.log(
                        'Password match + userID :',
                        req.session.userId
                    );
                    res.json({ success: true });
                } else {
                    console.log('Password unmatch');
                    throw 'error';
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.render('login', {
                layout: 'main',
                error: true,
                errMessage: err
            });
        });
});

app.get('/user', (req, res) => {
    var id = req.session.userId;
    // console.log('Id is here: ', id);

    db.getUserInfo(id)
        .then(results => {
            // console.log('our resutls:', results);
            res.json(results.rows[0]);
        })
        .catch(error => {
            console.log('Error in getting user info from the table: ', error);
            res.json({
                success: false
            });
        });
});





// ===== SAVE TRACK QUERY ========

app.post('/saveTrackQuery', (req, res) => {
    var query = req.body.query;
    var userId = req.session.userId;
    console.log('/friendRequest userId: ', userId);
    console.log('/friendRequest query: ', query);


    db.addTrackQuery(userId, query)
        .then(results => {
            console.log('Result from addTrackQuery: ', results.rows[0]);
            res.json(results.rows[0]);

        })
        .catch(error => {
            console.log('Error in addTrackQuery : ', error);
            res.json({ success: false });
        });



});

// ===== DELETE TRACK QUERY ========

app.post('/deleteTrackquery', (req, res) => {
    console.log('Inside deleteFriendRequest');
    var sender_id = req.session.userId;
    console.log('sender_id: ', sender_id);
    var receiver_id = req.body.receiver_id;
    db.deleteFriendRequest(receiver_id, sender_id).then(() => {
        res.json('');

    });
});

//====== PROFILE PIC UPLOAD ====

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    // console.log(
    //     'config.s3Url + req.file.filename, req.session.userId',
    //     config.s3Url + req.file.filename,
    //     req.session.user.userId
    // );

    console.log(req.session.userId);
    db.updateImage(config.s3Url + req.file.filename, req.session.userId)
        .then(data => {
            console.log('data', data);

            res.json({
                imageUrl: config.s3Url + req.file.filename
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});

//´======== GET TRACK QUERIES ===========

app.get('/receiveTrackQueries', (req, res) => {
    var userId = req.session.userId;
    console.log('userID: ', userId);
    db.receiveTrackQueries(userId)
        .then(results => {
            console.log('APP GET: results from receiveTrackQueries: ', results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log('APP GET: Error in receiveTrackQueries :', err);
            res.status(500).json({
                success: false
            });
        });
});

//========  SEND QUERIES TO SAPI  =====
app.get("/sendQueries", (req, res) => {
    var userId = req.session.userId;
    // console.log('userID: ', userId);

    db.receiveTrackQueries(userId)

        .then(queriesFromDb => {
            // console.log("results queriesFromDb", queriesFromDb);
            const preparedQueriesForApi = prepareQueriesForAPI(queriesFromDb);
            // console.log("preparedQueriesForApi ", preparedQueriesForApi);

            return getToken()

                .then(token => {
                    // console.log("TOKEN", token);
                    var arrayOfAPIResults = [];

                    for (let i = 0; i <     preparedQueriesForApi.length; i++) {
                        arrayOfAPIResults.push(getResults(token, preparedQueriesForApi[i]));
                    }
                    // console.log("arrayOfAPIResults ", arrayOfAPIResults);

                    return Promise.all (arrayOfAPIResults)

                        .then(bigFatResultsFromSpotify => {
                            // console.log("Resp from Promise all arrayOfAPIResults:  ", bigFatResultsFromSpotify);

                            var finalData = filterResults(bigFatResultsFromSpotify);
                            console.log("FINAL DATA ", finalData);
                            res.json(finalData);
                        });

                });


        })
        .catch(err => {
            console.log('Error after receiveTrackQueries :', err);
            res.status(500).json({
                success: false
            });
        });

});







//     var userId = req.session.userId;
//     console.log('userID: ', userId);
//     db.receiveTrackQueries(userId)
//         .then(results => {
//             console.log('results from receiveTrackQueries: ', results.rows);
//
//
//         })
//         .catch(err => {
//             console.log('Error in receiveTrackQueries :', err);
//             res.status(500).json({
//                 success: false
//             });
//         });
// });

//==== LOGOUT =====

app.get('/logout', (req, res) => {
    // req.session.destroy
    req.session = null;
    res.redirect('/welcome#/');
});

/// DO NOT TOUCH THIS LINE OF CODE
app.get('*', function(req, res) {
    if (!req.session.userId) {
        // if  not logged in, redirect to welcome
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});

// ====== CRONJOB SCHEDULER === //
// run every minute
cron.schedule("*/10 * * * *", function() {


    console.log("---------------------");
    console.log("Running send queries to API Cron Job");
    db.receiveTrackQueries(5)
        .then(queriesFromDb => {
        // console.log("results queriesFromDb", queriesFromDb);
            const preparedQueriesForApi = prepareQueriesForAPI(queriesFromDb);
            // console.log("preparedQueriesForApi ", preparedQueriesForApi);

            return getToken()

                .then(token => {
                // console.log("TOKEN", token);
                    var arrayOfAPIResults = [];

                    for (let i = 0; i <     preparedQueriesForApi.length; i++) {
                        arrayOfAPIResults.push(getResults(token, preparedQueriesForApi[i]));
                    }
                    // console.log("arrayOfAPIResults ", arrayOfAPIResults);

                    return Promise.all (arrayOfAPIResults)

                        .then(bigFatResultsFromSpotify => {
                            console.log("Resp from Promise all arrayOfAPIResults:  ", bigFatResultsFromSpotify);

                            var finalData = filterResults(bigFatResultsFromSpotify);
                            console.log("CRON SUCCESS FINAL DATA ", finalData);
                        });

                });


        })
        .catch(err => {
            console.log('Error in receiveTrackQueries :', err);

        });

    //call function here

});


//========= NODEMAILER STUFF ========
//
// var transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: {gmail_user},
//         pass: {gmail_pass}
//     }
// });
//
// const mailOptions = {
//   from: 'info.spotifier@gmail.com', // sender address
//   to: 'dominik.wenzel@outlook.com', // list of receivers
//   subject: 'Subject of your email', // Subject line
//   html: '<p>Your html here</p>'// plain text body
// };



//============ SERVER STUFF =====

server.listen(8080, function() {
    console.log("I'm listening.");
});
