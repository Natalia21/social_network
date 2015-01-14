var Server = require('../../../server');
var User = Server.User;
var app = Server.app;


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