var User  = require('../models/user');
var _ = require('lodash');
var url = require('url');

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
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var filter = query.filter;
        var limit = query.limit || 20;
        var skip = query.skip || 0;

        var find_data = {
            _id: {
                $ne: user_id
            }
        };

        if ( filter ) {
            var filter_data = {
                $regex: filter,
                $options: 'i'
            };
            find_data.$or = [{
                first_name: filter_data
            }, {
                last_name: filter_data
            }];
        }

        User.find(find_data, conditions)
            .limit(limit)
            .skip(skip)
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
