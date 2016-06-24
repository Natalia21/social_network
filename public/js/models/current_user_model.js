define([
    'jquery',
    'underscore',
    'backbone'
],function ($, _, Backbone) {
    var CurrentUserModel = Backbone.Model.extend({
        urlRoot: '/current_user',
        idAttribute : '_id',
        defaults : {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            friends: [],
            followers: [],
            subscriptions: []
        }
    });
    return CurrentUserModel;
});
