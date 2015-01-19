var Server = require('../../../server');
var User = Server.User;
var app = Server.app;

app.get("/user/:email/:password", function(req, res){
    User.find({email: req.params.email, password: req.params.password}, {password: 0, messages: 0}, function(err, data){
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