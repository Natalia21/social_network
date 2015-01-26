var express = require('express'),
    http = require('http'),
    path = require('path'),
    session = require('express-session'),
    redis = require("redis"),
    client = redis.createClient(),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    passport = require('passport'),
    LocalStrategy  = require('passport-local').Strategy;


require('./server/setup/mongodb');
var User = require('./server/models/user');
var Message = require('./server/models/msg');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));
});



// отлавливаем ошибки
client.on("error", function (err) {
    console.log("Error: " + err);
});


module.exports.app = app;
module.exports.io = io;
module.exports.User = User;
module.exports.Message = Message;
module.exports.client = client;


fs.readdirSync('./server/controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        require('./server/controllers/' + file);
    }
});


server.listen(8888);



























