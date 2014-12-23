var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path');

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
    password: String
});

var User = mongoose.model("User", UserSchema);

/*var first_user = new User({email: "petrov@mail.ru", password: "67890"});
first_user.save(function(err, first_user){
   if(err) return console.error(err);
    console.log( first_user);
});*/

app.configure(function(){
    app.use(express.bodyParser());
  //  app.use(express.methodOverride());
  //  app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get("/user/:email/:password", function(req, res){
   User.find({email: req.params.email, password: req.params.password}, function(err, data){
       if(err) throw err;
       //console.log(data);
       res.send(data);
   });
});
app.post("/user", function(req, res, next) {
    User.find({email: req.body.email}, function (err, data) {
        if (err) throw err;
        if (data) {
            res.send('User with this email has already existed');
        }
        else {
            next();
        }
    });
});
app.post("/user", function(req, res) {
    var new_user = new User({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password});
    new_user.save(function(err, new_user){
        if(err) throw err;
        res.send(new_user);
    });
});

app.get("/users", function(req, res){
    User.find(function(err, data){
        if(err) throw err;
        console.log(data);
        res.send(data);
    });
});
http.createServer(app).listen(8888);



























