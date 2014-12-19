define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'collections/login_collection'
], function($, _, Backbone, Router, LoginCollection){
    var initialize = function(){
        Router.initialize();
    };

    return {
        initialize: initialize,
    };
});