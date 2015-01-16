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
    'views/header_buttons',
    'views/my_friends',
    'views/init',
    'views/message_alerts'
], function($, _, Backbone, io, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView, ProfileView, HeaderViewFriends, KillFriendView, ConfirmRequestView, AddFriendView, FilterSearchView, WriteMsgView, DialoguesView, OneDialogueView, ButtonsEvents, MyFriendsView, InitView, MsgAlertsView){
    var AppRouter = Backbone.Router.extend({
        routes: {
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
        var sign_out_object = init.sign_out_object;
        var getUsersView = null;
        var app_router = new AppRouter;
        var object_for_filtred_data = {};
        _.extend(object_for_filtred_data, Backbone.Events);
        var filtered_data = new FilterSearchView(getUsersView);
        object_for_filtred_data.once("getUsersView", function(getUsersView) {
            filtered_data.initialize(getUsersView);
        });
        var registering = new RegisteringView();
        var profile = new ProfileView();
        var navbar = new NavbarView();
        var viewHeader = new HeaderView();
        var viewHeaderFriends = new HeaderViewFriends();
        var login = new LoginView(socket_is_ready_obj);
        var my_friends = new MyFriendsView();
        var one_dialogue = new OneDialogueView(socket_is_ready_obj);
        var dialogues = new DialoguesView();
        new MsgAlertsView(socket_is_ready_obj);
        new WriteMsgView(socket_is_ready_obj);
        new ButtonsEvents(sign_out_object);
        new KillFriendView();
        new ConfirmRequestView();
        new AddFriendView();


        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showLogin', function(){
            login.init();
        });

        app_router.on('route:showProfile', function(id){
            profile.init(id);
            navbar.init();
            viewHeader.init();
        });

        app_router.on('route:showMyFriends', function(id){
            navbar.init();
            viewHeaderFriends.init(id);
            my_friends.init(id);
        });

        app_router.on('route:showRefReq', function(id){
            viewHeaderFriends.init(id);
            navbar.init();
            my_friends.init(id);
        });

        app_router.on('route:showOneDialogue', function(id){
            viewHeader.init();
            navbar.init();
            one_dialogue.init(id);
        });

        app_router.on('route:showNewReq', function(id){
            viewHeaderFriends.init(id);
            navbar.init();
            my_friends.init(id);
        });

        app_router.on('route:showDialogues', function(){
            viewHeader.init();
            navbar.init();
            dialogues.init();
        });

        app_router.on('route:showRegistering', function(){
            registering.init();
        });

        app_router.on('route:showUsersList', function(){
            viewHeader.init();
            navbar.init();
            getUsersView =  new GetUsersView();
            object_for_filtred_data.trigger("getUsersView", getUsersView);
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});