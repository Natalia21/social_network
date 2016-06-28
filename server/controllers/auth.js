var User = require('../models/user');

module.exports = {
    login: function (req, res) {
        var find_data  = {'email': req.params.email,
                         'password': req.params.password},
            conditions = {password: 0};

        User.findOne(find_data, conditions, function (err, data) {
            if ( err ) throw err;
            if ( ! data ) {
                res.status(500).send({'msg': 'Error! User with this email and password is not found!'});
            }
            else {
                req.session.authorized = true;
                req.session.user_id = data._id;
                res.send(data);
            }
        });
    },

    signUpValidation: function (req, res, next) {
        var find_data = {'email': req.body.email};

        User.findOne(find_data, function (err, data) {
            if ( err ) throw err;
            if ( data ) {
                res.status(500).send({'msg': 'User with this email has already existed'});
            }
            else {
                next();
            }
        });
    },

    signUp: function (req, res) {
        var new_user = new User({'first_name': req.body.first_name,
                                 'last_name': req.body.last_name,
                                 'email': req.body.email,
                                 'password': req.body.password});

        new_user.save(function (err) {
            if ( err ) throw err;
            req.session.authorized = true;
            req.session.user_id = new_user._id;
            res.send(new_user);
        });
    },

    getCurrentUser: function (req, res) {
        var find_data       = {'_id': req.session.user_id},
            conditions      = {'password': 0},
            populate_data   = 'friends subscriptions followers',
            populate_fields = 'first_name last_name email';

        User.findOne(find_data, conditions)
            .populate(populate_data, populate_fields)
            .exec( function (err, data) {
                if ( err ) throw err;
                if ( ! data ) {
                    res.status(500).send({msg: 'User is not found!'});
                }
                res.send(data);
            });
    },

    signOut: function(req, res) {
        delete req.session.authorized;
        delete req.session.user_id;
        res.send({'text': 'OK'});
    }
};
