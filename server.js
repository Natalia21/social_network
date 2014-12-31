var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    session = require('express-session');
var app = express();
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
    friends: Array
});

var User = mongoose.model("User", UserSchema);


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


app.get("/user/:email/:password", function(req, res){
    User.find({email: req.params.email, password: req.params.password}, function(err, data){
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
    User.find({_id: req.params.id}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});

app.get("/user", function(req, res){
    User.find({email: req.session.email}, function(err, data){
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
    new_user.save(function(err, new_user){
        if(err) throw err;
        res.send(new_user);
    });
});
app.post("/sign_out", function(req, res) {
    delete req.session.authorized;
    delete req.session.email;
    res.send({text: 'OK'});
});



app.put("/user", function(req, res, next) {
    console.log(req.body.friends);
    if(req.body.friends.confirm == true){
        User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
            if(err) throw err;
            User.find({_id: req.body.id}, function(err, data){
                if(err) throw err;
            });
        });
    }
    if(req.body.friends.confirm == undefined && req.body.friends._new == undefined){
        console.log(1);
        next();
    }
    else{
        console.log(2);
        User.update({_id: req.body.id}, {$push: {friends: req.body.friends}}, function(err, data){
            if(err) throw err;
            User.find({_id: req.body.id}, function(err, data){
                if(err) throw err;
            });
        });
        User.find({_id: req.body.id}, function(err, data){
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
    User.find(function(err, data){
        if(err) throw err;
        res.send(data);
    });
});
http.createServer(app).listen(8888);



























