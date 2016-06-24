var User  = require('../models/user'),
    _     = require('lodash'),
    async = require('async');

module.exports = {
    addFriend: function (req, res) {
        var user_id   = req.session.user_id,
            friend_id = req.body.friend_id;
        var find_data   = {'_id': user_id, 'followers': friend_id};

        User.find(find_data, function (err, data) {
            if ( err ) throw err;

            if ( data && data.length ) {
                addFriend(req, res);
            } else {
                followFriend(req, res);
            }
        });
    },

    removeFriend: function (req, res) {
        var user_id   = req.session.user_id,
            friend_id = req.body.friend_id;
        var find_data   = {'_id': user_id, 'subscriptions': friend_id};

        User.find(find_data, function (err, data) {
            if ( err ) throw err;

            if ( data && data.length ) {
                removeFromSubscriptions(req, res);
            } else {
                removeFromFriends(req, res);
            }
        });        
    }
}

var isErrorInUpdate = function (err, data) {
    if ( err ) throw err;
    return data.ok == 0;
};

var udateUserAndFriend = function (options, res) {
    User.update(options.find_user_data,
                options.update_user_data,
                function (err, data) {
                    if ( isErrorInUpdate(err, data) ) {
                        return res.status(500).send({'msg': 'Error'});
                    }

                    User.update(options.find_friend_data,
                                options.update_friend_data,
                                function (err, data) {
                                    if ( isErrorInUpdate(err, data) ) {
                                        return res.status(500).send({'msg': 'Error'});
                                    }
                                    res.send({'msg': 'Success'});
                                });            
                });
}

var addFriend = function (req, res) {
    var user_id   = req.session.user_id,
        friend_id = req.body.friend_id;
    var options = {};

    options.find_user_data     = {'_id': user_id};
    options.update_user_data   = {'$pull': {'followers': friend_id},
                                  '$push': {'friends': friend_id} };
    options.find_friend_data   = {'_id': friend_id};
    options.update_friend_data = {'$pull': {'subscriptions': user_id},
                                  '$push': {'friends': user_id}};

    udateUserAndFriend(options, res);
}

var followFriend = function (req, res) {
    var user_id   = req.session.user_id,
        friend_id = req.body.friend_id;
    var options = {};

    options.find_user_data     = {'_id': user_id};
    options.update_user_data   = {'$push': {'subscriptions': friend_id}};

    options.find_friend_data   = {'_id': friend_id};
    options.update_friend_data = {'$push': {'followers': user_id}};

    udateUserAndFriend(options, res);
}

var removeFromSubscriptions = function (req, res) {
    var user_id   = req.session.user_id,
        friend_id = req.body.friend_id;
    var options = {};

    options.find_user_data     = {'_id': user_id};
    options.update_user_data   = {'$pull': {'subscriptions': friend_id}};

    options.find_friend_data   = {'_id': friend_id};
    options.update_friend_data = {'$pull': {'followers': user_id}};

    udateUserAndFriend(options, res);
}

var removeFromFriends = function (req, res) {
    var user_id   = req.session.user_id,
        friend_id = req.body.friend_id;
    var options = {};

    options.find_user_data     = {'_id': user_id};
    options.update_user_data   = {'$pull': {'friends': friend_id}};

    options.find_friend_data   = {'_id': friend_id};
    options.update_friend_data = {'$pull': {'friends': user_id}};

    udateUserAndFriend(options, res);
}
