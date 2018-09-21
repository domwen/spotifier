const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require('compression');

const db = require('./src/db');
const { hashPass, checkPass } = require('./src/hash');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const s3 = require('./s3.js');
const config = require('./config.json');

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

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            // console.log('hashedSaltedPw', hashedSaltedPw);
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
                            url: user.url,
                            bio: user.bio
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

app.get('/get-user/:userId', (req, res) => {
    if (req.params.userId == req.session.userId) {
        return res.json({
            ownProfile: true
        });
    }
    db.otherProfile(req.params.userId)
        .then(results => {
            console.log('otherProfile results: ', results.rows[0]);
            if (results.rows[0] == null) {
                res.json({
                    IdExists: false
                });
            } else {
                res.json(results.rows[0]);
            }
        })
        .catch(error => {
            console.log('error in otherProfile', error);
        });
});

//´======== GET FRIENDSHIP STATUS ===========
app.get('/friendship-status/:otherId', (req, res) => {
    let otherId = req.params.otherId;
    let ownId = req.session.userId;

    console.log('otherId: ', otherId);
    console.log('ownID: ', ownId);

    db.getFriendshipStatus(ownId, otherId)
        .then(results => {
            console.log('Results from getFriendshipStatus: ', results);
            res.json(results.rows[0]);
        })
        .catch(error => {
            console.log('Error in getting user info from the table: ', error);
            res.json({
                success: false
            });
        });
});

// ===== MAKE FRIEND REQUEST ========

app.post('/friendRequest', (req, res) => {
    var friendshipStatus = req.body.status;
    var sender_id = req.session.userId;
    var receiver_id = req.body.receiver_id;
    console.log('/friendRequest receiver_id: ', receiver_id);
    console.log('/friendRequest status: ', friendshipStatus);

    if (friendshipStatus == 1) {
        db.newFriendRequest(friendshipStatus, sender_id, receiver_id)
            .then(results => {
                console.log('Result from newFriendRequest: ', results);
                res.json(results.rows[0]);
                let key;
                for (key in onlineUsers) {
                    if (onlineUsers[key] == receiver_id) {
                        console.log(
                            'Inside socketReceiverId thingy',
                            key,
                            receiver_id
                        );
                        io.sockets.sockets[key].emit('friendNotification', {
                            message: 'You have a friend request from ',
                            senderFirst: req.session.user.first,
                            senderLast: req.session.user.last
                        });
                    }
                }
            })
            .catch(error => {
                console.log('Error in making friend request: ', error);
                res.json({ success: false });
            });
    } else {
        console.log(
            'Before updateFriendRequest: ',
            friendshipStatus,
            receiver_id,
            sender_id
        );
        db.updateFriendRequest(friendshipStatus, receiver_id, sender_id)
            .then(results => {
                console.log(
                    'Results from updateFriendRequest',
                    results.rows[0]
                );
                res.json(results.rows[0]);
                let key;
                for (key in onlineUsers) {
                    if (onlineUsers[key] == receiver_id) {
                        console.log(
                            'Inside socketReceiverId thingy',
                            key,
                            receiver_id
                        );
                        io.sockets.sockets[key].emit('friendNotification', {
                            message: 'You are now friends with ',
                            senderFirst: req.session.user.first,
                            senderLast: req.session.user.last
                        });
                    }
                }
            })
            .catch(error => {
                console.log('Error in making friend request: ', error);
                res.json({ success: false });
            });
    }
});

// ===== DELETE FRIEND REQUEST ========

app.post('/deleteFriendRequest', (req, res) => {
    console.log('Inside deleteFriendRequest');
    var sender_id = req.session.userId;
    console.log('sender_id: ', sender_id);
    var receiver_id = req.body.receiver_id;
    db.deleteFriendRequest(receiver_id, sender_id).then(() => {
        res.json('');
        let key;
        for (key in onlineUsers) {
            if (onlineUsers[key] == receiver_id) {
                console.log('Inside socketReceiverId thingy', key, receiver_id);
                io.sockets.sockets[key].emit('friendNotification', {
                    message: 'You got unfriended by ',
                    senderFirst: req.session.user.first,
                    senderLast: req.session.user.last
                });
            }
        }
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

//´======== GET FRIENDS AND WANNABES ===========

app.get('/listOfFriends', (req, res) => {
    var userId = req.session.userId;
    console.log('userID: ', userId);
    db.receiveFriends(userId)
        .then(results => {
            // console.log('results from receiveFriends: ', results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log('Error in listOfFriends :', err);
            res.status(500).json({
                success: false
            });
        });
});

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

server.listen(8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};

io.on('connection', function(socket) {
    console.log(`socket with id ${socket.id} has connected`);
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let socketId = socket.id;
    const userId = socket.request.session.userId;
    console.log(`user with userid ${userId} has connected`);

    // // add socketid: userid to onlineUsers object
    onlineUsers[socketId] = userId;
    let arrayOfUserIds = Object.values(onlineUsers);

    console.log('arrayOfUserIds: ', arrayOfUserIds);
    db.getUsersByIds(arrayOfUserIds).then(results => {
        //results is array with all the user info (first, name, url, )
        // then emit that array to the client and make it put it in Redux
        // console.log('Results after getUsersbyIds: ', results.rows);
        socket.emit('onlineUsers', results.rows);

        // Emit to everyone BUT the person who just connected

        if (
            arrayOfUserIds.filter(id => id == socket.request.session.userId)
                .length == 1
        ) {
            console.log('We passed the condition');
            db.getUserInfo(socket.request.session.userId).then(results => {
                console.log('New user logged in info: ', results.rows[0]);

                socket.broadcast.emit('newUserOnline', results.rows);
            });
        }

        socket.on('disconnect', function() {
            delete onlineUsers[socket.id];

            console.log('DISCONNECT: ', onlineUsers);
            console.log(
                'CHECK DISCONNECT',
                Object.values(onlineUsers).includes(userId)
            );

            if (!Object.values(onlineUsers).includes(userId)) {
                console.log('Id is not there');
                console.log(
                    `socket with the id ${socket.id} is now disconnected`
                );
                io.sockets.emit('disconnectUser', userId);
            }

            // in this situation there is no difference between emit and broadcast
            // plurar if io.sockets
        });

        // ==== CHAT CHAT CHAT ===

        db.getRecentMessages().then(results => {
            socket.emit('chatMessages', results.rows);
        });
        console.log('getRecentMessages results', results);

        socket.on('chat', message => {
            let newDetails = [
                {
                    id: socket.request.session.userId,
                    first: socket.request.session.user.first,
                    last: socket.request.session.user.last,
                    url: socket.request.session.user.url
                }
            ];

            db.addMessage(
                userId,
                message,
                socket.request.session.user.url
            ).then(results => {
                let userDetails = Object.assign(
                    {},
                    newDetails[0],
                    results.rows[0]
                );
                console.log('userDetails???: ', userDetails);
                io.sockets.emit('newChatMessage', userDetails);
            });
        });
    });
});
