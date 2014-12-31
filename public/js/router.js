define([
    'jquery',
    'underscore',
    'backbone',
    'views/login_view',
    'views/registering_view',
    'views/navbar_view',
    'views/get_users_view',
    'views/header_view',
    'views/profile_view',
    'views/header_view_friends',
    'views/my_friends_view',
    'views/ref_requests_view',
    'views/new_requests_view',
    'views/kill_friend_view'
], function($, _, Backbone, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView, ProfileView, HeaderViewFriends, MyFriendsView, RefRequestsView, NewRequestsView, KillFriendView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showLogin',
            'login': 'showLogin',
            'registering': 'showRegistering',
            'profile/:id': 'showProfile',
            'friends/my_friends/:id': 'showMyFriends',
            'friends/reference_requests/:id': 'showRefReq',
            'friends/new_requests/:id': 'showNewReq',
            'search': 'showUsersList',
            '*actions': 'defaultAction'
        }
    });


    var initialize = function(){
        var app_router = new AppRouter;
        new KillFriendView();
        var view = null;
        var viewHeader = null;
        var viewHeaderFriends = null;
        app_router.on('route:showLogin', function(){
            new LoginView();
        });

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showProfile', function(id){
            if(viewHeader){
                viewHeader.initialize();
            }
            else{
                viewHeader =  new HeaderView();
            }
            new NavbarView();
            new ProfileView(id);
        });

        app_router.on('route:showMyFriends', function(id){
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
             new NavbarView();
            new MyFriendsView(id);
        });
        app_router.on('route:showRefReq', function(id){
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
            new NavbarView();
            new RefRequestsView(id);
        });
        app_router.on('route:showNewReq', function(id){
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
            new NavbarView();
            new NewRequestsView(id);
        });

        app_router.on('route:showRegistering', function(){
           new RegisteringView();
        });
        app_router.on('route:showUsersList', function(){
            if(viewHeader){
                viewHeader.initialize();
            }
            else{
                viewHeader =  new HeaderView();
            }
            new NavbarView();
            if (view) {
                view.initialize();
            }
            else {
                view = new GetUsersView();
            }

        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});