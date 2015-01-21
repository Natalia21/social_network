var Server = require('../../../../server');
var User = Server.User;
var app = Server.app;

app.get("/user/:id", function(req, res){
    User.find({_id: req.params.id}, {password: 0, messages: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});