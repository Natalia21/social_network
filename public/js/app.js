define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'collections/users_collection'
], function($, _, Backbone, Router, UsersCollection){
    var initialize = function(){
        window.App = {
            Models: {},
            Collections: {},
            Views: {},
            Router: {}
        };
        Router.initialize();
    };

    return {
        initialize: initialize
    };
});