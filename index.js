const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./src/db');
const { hashPass, checkPass } = require('./src/hash');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const s3 = require('./s3.js');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const config = require('./config.json');

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

app.use(compression());

app.use(require('body-parser').json());

app.use(
    cookieSession({
        secret: `Döner Kebap`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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

// ^^ BOILERPLATE STUFF ENDS HERE ^^

app.get('/welcome', function(req, res) {
    console.log('req: ', req);
    if (req.session.userId) {
        // if logged in, redirect to root
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', (req, res) => {
    let { first, last, email, pass } = req.body;
    console.log('insider POST register');
    console.log('req:', req);
    hashPass(pass)
        .then(hashedSaltedPw => {
            // console.log('hashedSaltedPw', hashedSaltedPw);
            const params = [
                first || null,
                last || null,
                email || null,
                hashedSaltedPw || null
            ];
            db.saveUser(params).then(savedUserData => {
                console.log('savedUserData :', savedUserData);
                req.session.user = {
                    firstName: savedUserData.rows[0].first,
                    lastName: savedUserData.rows[0].last,
                    userId: savedUserData.rows[0].id
                };
                console.log('req.session :', req.session);
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
    console.log('insider POST login');
    console.log('req.body:', req.body);
    db.getPassword(email)
        .then(password => {
            var userDataObject = password;
            var storedPw = password.rows[0].password;
            checkPass(pass, storedPw).then(result => {
                if (result) {
                    console.log(
                        'inside POST login after checkpass :',
                        userDataObject
                    );
                    req.session = {
                        user: {
                            userId: userDataObject.rows[0].id,
                            firstName: userDataObject.rows[0].first,
                            lastName: userDataObject.rows[0].last,
                            url: userDataObject.rows[0].url
                        }
                    };
                    console.log('Password match :', req.session.user);
                    res.json({ success: true });
                } else {
                    throw 'error';
                    console.log('Password unmatch');
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
    console.log('app GET USER req.session.user', req.session.user);
    res.json(req.session.user);
});

/// DO NOT TOUCH THIS LINE OF CODE
app.get('*', function(req, res) {
    if (req.session.userId) {
        // if  not logged in, redirect to welcome
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('Inside app.post /upload');
    if (req.file) {
        db.saveFile(
            // call saveFile module in db.js
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        )
            .then(({ rows }) => {
                console.log('Image succesfully saved in DB', rows);
                res.json({
                    success: true,
                    image: rows[0]
                });
            })
            .catch(err => {
                console.log('Error in upload catch', err);
                res.status(500).json({
                    success: false
                });
            });
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
