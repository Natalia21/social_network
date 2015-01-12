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

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    friends: Array,
    messages: Array
});

var User = mongoose.model("User", UserSchema);

var SocketSchema = new mongoose.Schema({
    socket_id: String,
    user_id: String
});

var Socket = mongoose.model("Socket", SocketSchema);


app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    } ));
  //  app.use(express.methodOverride());
  //  app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

io.sockets.on('connection', function (socket) {
    var ID = socket.handshake.query.ID;
    Socket.find({user_id: ID}, function(err, data){
        if(err) throw err;
        if(!data[0]){
            var new_user = new Socket({socket_id: socket.id, user_id: ID});
            new_user.save(function(err, data){
                if(err) throw err;
            });
        }
        else{
            Socket.update({user_id: ID}, {$set: {socket_id: socket.id}})
        }
    });
    socket.on('message_to_server', function (message) {
        var message = {
            from: ID,
            to: message.to,
            text: message.message,
            time: (new Date).toLocaleTimeString()
        };
        try {
            User.update({_id: ID}, {$push:{messages: message}}, function(err, data){
                if(err) throw err;
            });
            User.update({_id: message.to}, {$push:{messages: message}}, function(err, data){
                if(err) throw err;
            });
            socket.emit('message', message);
            Socket.find({user_id: message.to}, function(err, data){
                if(err) throw err;
                if(data[0]) {
                    io.to(data[0].socket_id).emit('message', message);
                }
            })
        } catch (e) {
            console.log(e);
        }
    });
});

app.get("/user/:email/:password", function(req, res){
    User.find({email: req.params.email, password: req.params.password}, {password: 0}, function(err, data){
        if(err) throw err;
        if(!data[0]){
            res.send({text: 'Error! User with this email and password is not defined!'});
        }
        else{
            req.session.authorized = true;
            req.session.email = req.params.email;
            res.send(data);
        }
    });
});
app.get("/user/:id", function(req, res){
    User.find({_id: req.params.id}, {password: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});

app.get("/user", function(req, res){
    User.find({email: req.session.email}, {password: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});
app.post("/user", function(req, res, next) {
    User.find({email: req.body.email}, function (err, data) {
        if (err) throw err;
        if (data && data[0]) {
            res.send({text: 'User with this email has already existed'});
        }
        else {
            next();
        }
    });
});
app.post("/user", function(req, res) {
    var new_user = new User({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password});
    req.session.authorized = true;
    req.session.email = req.body.email;
    new_user.save(function(err){
        if(err) throw err;
        User.find({email: req.body.email}, {password: 0}, function(err, data){
            if(err) throw err;
            res.send(data);
        });
    });
});
app.post("/sign_out", function(req, res) {
    delete req.session.authorized;
    delete req.session.email;
    res.send({text: 'OK'});
});

app.put("/user", function(req, res, next) {
    if(req.body.friends.confirm == true){
        User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
            if(err) throw err;
        });
    }
    if(req.body.friends.confirm == undefined && req.body.friends._new == undefined){
        next();
    }
    else{
        User.update({_id: req.body.id}, {$push: {friends: req.body.friends}}, function(err, data){
            if(err) throw err;
        });
        User.find({_id: req.body.id}, {password: 0}, function(err, data){
            if(err) throw err;
            res.send(data);
        });
    }
});
app.put("/user", function(req, res) {
    User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
        if(err) throw err;
    });
    User.update({_id: req.body.friends.id}, {$pull: {friends: {id: req.body.id}}}, function(err, data){
        if(err) throw err;
    });
    User.find({_id: req.body.friends.id}, function(err, data){
        if(err) throw err;
        res.send({text: "Пользователь " + data[0].first_name + " " + data[0].last_name + " удалён"});
    });
});
app.get("/users", function(req, res){
    User.find({}, {password: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});

app.get("/users/:filtered_data", function(req, res){
    var new_data = [];
    User.find({}, {password: 0}, function(err, data){
        if(err) throw err;
        var filtered_first_name = "^" + req.params.filtered_data.split(" ")[0];
        var reg_first_name = new RegExp(filtered_first_name);
        if(req.params.filtered_data.split(" ")[1]){
            var filtered_last_name = "^" + req.params.filtered_data.split(" ")[1];
            var reg_last_name = new RegExp(filtered_last_name);
            data.forEach(function(index){
                if(index.first_name.toLowerCase() == req.params.filtered_data.split(" ")[0] && reg_last_name.test(index.last_name.toLowerCase())){
                    new_data.push(index);
                }
            })
        }
        else{
            data.forEach(function(index){
                if(reg_first_name.test(index.first_name.toLowerCase())){
                    new_data.push(index);
                }
            })
        }
        res.send(new_data);
    });
});
server.listen(8888);



























