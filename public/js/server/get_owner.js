var Server = require('../../../server');
var User = Server.User;
var app = Server.app;

app.get("/user", function(req, res){
    User.find({email: req.session.email}, {password: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});