var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    session = require('express-session'),
    connect_redis = require('connect-redis')(session),
    config = require('./config'),
    app = express();

mongoose.connect(config.db, function (err) {
    if ( err ) {
        console.log("error in conecting with database", err)
    } else {
        console.log("successfully connected to the database");
    }
});

console.log(config.redis);

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(session({
        store: new connect_redis(config.redis),
        secret: 'secret',
        resave: true,
        saveUninitialized: false
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app),
    io = require('socket.io').listen(server);

module.exports.app = app;
module.exports.io = io;

require('./server/route.js');

server.listen(config.port);
