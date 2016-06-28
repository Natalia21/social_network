define([
    'jquery',
    'underscore',
    'backbone'
],function ($, _, Backbone) {
    var SessionModel = Backbone.Model.extend({
        defaults:{
            authenticated: false,
            user: null
        },

        initialize: function () {

        },

        getUser: function() {
            return this.get('user');
        },

        setUser: function(user) {
            this.set('user', user);
            return this;
        },

        isAuthenticated: function() {
            return this.get('authenticated');
        },

        setAuthenticated: function(authenticated) {
            this.set('authenticated', authenticated);
            return this;
        }
    });
    return SessionModel;
});
