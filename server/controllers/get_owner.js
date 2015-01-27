var Server = require('../../server');
var User = Server.User;
var app = Server.app;

app.get('/owner', function(req, res){
        res.send(req.user);
});