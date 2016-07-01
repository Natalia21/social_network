var User  = require('../models/user'),
    _     = require('lodash');

var conditions = {
    password: 0,
    friends: 0,
    followers: 0,
    subscriptions: 0
};

var isUserAFriend = function (user, friends) {
    var friend = _.find(friends, function (friend_id) {
        return friend_id.toString() === user._id.toString();
    });
    return !! friend;
};

var isUserAFollower = function (user, followers) {
    var follower = _.find(followers, function (follower_id) {
        return follower_id.toString() === user._id.toString();
    });
    return !! follower;
};

var isUserInSubscriptions = function (user, subscriptions) {
    var subscription = _.find(subscriptions, function (subscription_id) {
        return subscription_id.toString() === user._id.toString();
    });
    return !! subscription;
};

module.exports = {
    getAllUsers: function (req, res) {
        var user_id = req.session.user_id;
        var find_data = {
            _id: {
                $ne: user_id
            }
        };

        User.find(find_data, conditions)
            .lean()
            .exec(function (err, users) {
                if ( err ) throw err;

                var find_data  = {
                    _id: user_id
                };
                User.findOne(find_data, function (err, current_user) {
                    if ( err ) throw err;
                    _.each(users, function (user) {
                        user.is_a_friend = isUserAFriend(user, current_user.friends);
                        user.is_a_follower = isUserAFollower(user, current_user.followers);
                        user.is_in_subscriptions = isUserInSubscriptions(user, current_user.subscriptions);
                    });
                    res.send(users);
                });
            });
    },

    getUserById: function (req, res) {
        var find_data = {
            _id: req.params.id
        };

        User.findOne(find_data, conditions, function (err, data) {
            if ( err ) throw err;
            res.send(data);
        });
    }
};
