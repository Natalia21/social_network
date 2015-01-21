var Server = require('../../../../server');
var User = Server.User;
var app = Server.app;

app.get("/owner", function(req, res){
    User.find({email: req.session.email}, {password: 0, messages: 0}, function(err, data){
        if(err) throw err;
        console.log(data);
        res.send(data);
    });
});