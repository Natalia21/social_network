var Server = require('../../server');
var User = Server.User;
var app = Server.app;
var passport = require('passport');
require('../setup/passport');

app.post('/login', function(req, res, next){
    passport.authenticate('login', function(err, user){
        return err ? next(err) :
               user ? req.logIn(user, function(err) {
                    return err ? next(err) :
                           res.send(user);
                }) : res.send({text: 'Error! User with this email and password is not defined!'});
    })(req, res, next);

});


