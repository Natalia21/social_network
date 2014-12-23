define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
],function($, _, Backbone, UserModel){
    var UsersCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users'
    });
    return UsersCollection;
});
