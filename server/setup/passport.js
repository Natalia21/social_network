
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done){
        User.findOne({ email : username},function(err,user){
            if(err) return err;
            if(user && password === user.password){
                user.password = null;
                return done(null, user);
            }
            done(null, false);
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
        err
            ? done(err)
            : done(null,user);
    });
});
