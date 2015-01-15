var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    session = require('express-session'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);


mongoose.connect("mongodb://localhost/test", function (err) {
    if (err) {
        console.log("error in conecting with database")
    } else {
        console.log("successfully connected to the database");
    }
});


var User = require('./public/js/server/user_scheme');


app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    } ));
    app.use(express.static(path.join(__dirname, 'public')));
});


module.exports.app = app;
module.exports.io = io;
module.exports.User = User;



require('./public/js/server/socket_msgs');
require('./public/js/server/login');
require('./public/js/server/get_user_by_id');
require('./public/js/server/get_owner');
require('./public/js/server/registering');
require('./public/js/server/sign_out');
require('./public/js/server/update_user_friends');
require('./public/js/server/get_all_users');
require('./public/js/server/search');

server.listen(8888);



























