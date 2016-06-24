define([
    'jquery',
    'underscore',
    'backbone'
],function ($, _, Backbone) {
    var UserModel = Backbone.Model.extend({
        urlRoot: '/user',
        idAttribute : '_id',
        defaults : {
            first_name: '',
            last_name: '',
            email: '',
            is_a_friend: false,
            is_a_follower: false,
            is_in_subscriptions: false
        }
    });
    return UserModel;
});
