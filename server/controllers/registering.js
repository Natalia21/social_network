var Server = require('../../server');
var User = Server.User;
var app = Server.app;


app.post('/user', function(req, res, next) {
    var new_user = new User({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password});
    new_user.save(function(err) {
        return err ? next(err) :
               req.login(new_user, function(err) {
                   var user_for_send = req.user;
                   user_for_send.password = null;
                   return err ? next(err) : res.send(user_for_send);
                });
    });
});