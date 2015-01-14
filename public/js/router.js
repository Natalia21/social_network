define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'views/login',
    'views/registering',
    'views/navbar',
    'views/get_users',
    'views/header',
    'views/profile',
    'views/header_friends',
    'views/kill_friend',
    'views/confirm_request',
    'views/add_friend',
    'views/filter_search',
    'views/write_msg',
    'views/dialogues',
    'views/one_dialogue',
    'views/buttons_events',
    'views/my_friends',
    'views/init'
], function($, _, Backbone, io, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView, ProfileView, HeaderViewFriends, KillFriendView, ConfirmRequestView, AddFriendView, FilterSearchView, WriteMsgView, DialoguesView, OneDialogueView, ButtonsEvents, MyFriendsView2, InitView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            //'': 'showProfile',
            'login': 'showLogin',
            'registering': 'showRegistering',
            'profile/:id': 'showProfile',
            'friends/my_friends/:id': 'showMyFriends',
            'friends/reference_requests/:id': 'showRefReq',
            'friends/new_requests/:id': 'showNewReq',
            'search': 'showUsersList',
            'messages': 'showDialogues',
            'messages/:id': 'showOneDialogue',
            '*actions': 'defaultAction'
        }
    });


    var initialize = function(){
        var init = new InitView();
        var socket_is_ready_obj = init.socket_is_ready_obj;
        var viewHeader = null;
        var viewHeaderFriends = null;
        var navbar = null;
        var getUsersView = null;
        var login = null;
        var app_router = new AppRouter;
        var object_for_filtred_data = {};
        _.extend(object_for_filtred_data, Backbone.Events);
        var filtered_data = new FilterSearchView(getUsersView);
        object_for_filtred_data.once("getUsersView", function(getUsersView) {
            filtered_data.initialize(getUsersView);
        });
        var write_msg = new WriteMsgView(socket_is_ready_obj);
        var sign_out_object = init.sign_out_object;
        new ButtonsEvents(sign_out_object);
        new KillFriendView();
        new ConfirmRequestView();
        new AddFriendView();

        var check = function(It, it, params){
            if(it){
                console.log('ROUTE LOGIN IF')
                it.initialize(params);
            }
            else{
                console.log('ROUTE LOGIN ELSE')
                it = new It(params)
                console.log(it);
            }
        };

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showLogin', function(){
            console.log('ROUTE LOGIN')
            check(LoginView, login, socket_is_ready_obj);
        });

        app_router.on('route:showProfile', function(id){
            new ProfileView(id);
            check(NavbarView, navbar);
            check(HeaderView, viewHeader);
        });

        app_router.on('route:showMyFriends', function(id){
            check(NavbarView, navbar);
            check(HeaderViewFriends, viewHeaderFriends, id);
            new MyFriendsView2(id);
        });

        app_router.on('route:showRefReq', function(id){
            check(NavbarView, navbar);
            check(HeaderViewFriends, viewHeaderFriends, id);
            new MyFriendsView2(id);

        });

        app_router.on('route:showOneDialogue', function(id){
            check(NavbarView, navbar);
            check(HeaderView, viewHeader);
            new OneDialogueView(id);
        });

        app_router.on('route:showNewReq', function(id){
            check(NavbarView, navbar);
            check(HeaderViewFriends, viewHeaderFriends, id);
            new MyFriendsView2(id);
        });

        app_router.on('route:showDialogues', function(){
            check(NavbarView, navbar);
            check(HeaderView, viewHeader);
            new DialoguesView();
        });

        app_router.on('route:showRegistering', function(){
            check(RegisteringView);
        });

        app_router.on('route:showUsersList', function(){
            check(NavbarView, navbar);
            check(HeaderView, viewHeader);
            getUsersView =  new GetUsersView();
            object_for_filtred_data.trigger("getUsersView", getUsersView);
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});