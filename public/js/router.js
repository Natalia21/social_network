define([
    'jquery',
    'underscore',
    'backbone',
    'views/login_view',
    'views/registering_view',
    'views/navbar_view',
    'views/get_users_view',
    'views/header_view'
], function($, _, Backbone, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showLogin',
            'login': 'showLogin',
            'registering': 'showRegistering',
            'profile/:id': 'showProfile',
            'search': 'showUsersList',
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(){
        var app_router = new AppRouter;
        app_router.on('route:showLogin', function(){
            new LoginView();
        });

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showProfile', function(id){
            new HeaderView();
            new NavbarView(id);
        });

        app_router.on('route:showRegistering', function(){
           new RegisteringView();
        });
        app_router.on('route:showUsersList', function(){
            new GetUsersView();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});