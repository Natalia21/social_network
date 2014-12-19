define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
],function($, _, Backbone, UserModel){
    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/user'
    });
    return UserCollection;
});
