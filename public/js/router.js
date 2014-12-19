define([
    'jquery',
    'underscore',
    'backbone',
    'views/login_view',
    'views/registering_view',
    'views/profile_view'
], function($, _, Backbone, LoginView, RegisteringView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showLogin',
            'login': 'showLogin',
            'registering': 'showRegistering',
            'profile/:id': 'showProfile',
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(){
        var app_router = new AppRouter;
        app_router.on('route:showLogin', function(){
            var loginView = new LoginView();
        });

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showProfile', function(id){
         /*   var profileView = new ProfileView();
            ProfileView.initialize();*/
            console.log('id: ', id);
        });

        app_router.on('route:showRegistering', function(){
           var registeringView = new RegisteringView();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});