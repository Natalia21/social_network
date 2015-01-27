define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function($, _, Backbone, Router){
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