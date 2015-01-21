var Server = require('../../../../server');
var User = Server.User;
var app = Server.app;

app.get("/users", function(req, res){
    User.find({}, {password: 0, messages: 0}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});