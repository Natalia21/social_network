define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'views/login_view',
    'views/registering_view',
    'views/navbar_view',
    'views/get_users_view',
    'views/header_view',
    'views/profile_view',
    'views/header_view_friends',
    'views/kill_friend_view',
    'views/confirm_request_view',
    'views/add_friend_view',
    'views/filter_search_view',
    'views/write_msg_view',
    'views/dialogues_view',
    'views/one_dialogue_view',
    'views/buttons_events',
    'views/my_friends_view2'
], function($, _, Backbone, io, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView, ProfileView, HeaderViewFriends, KillFriendView, ConfirmRequestView, AddFriendView, FilterSearchView, WriteMsgView, DialoguesView, OneDialogueView, ButtonsEvents, MyFriendsView2){
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
            'messages': 'showDialogues',
            'messages/:id': 'showOneDialogue',
            '*actions': 'defaultAction'
        }
    });


    var initialize = function(){
        var viewHeader = null;
        var viewHeaderFriends = null;
        var navbar = null;
        var getUsersView = null;
        var app_router = new AppRouter;
        var object_for_filtred_data = {};
        _.extend(object_for_filtred_data, Backbone.Events);
        var filtered_data = new FilterSearchView(getUsersView);
        object_for_filtred_data.once("getUsersView", function(getUsersView) {
            filtered_data.initialize(getUsersView);
        });
        var write_msg = new WriteMsgView();
        var sign_out_object = write_msg.sign_out_object;
        new ButtonsEvents(sign_out_object);
        new KillFriendView();
        new ConfirmRequestView();
        new AddFriendView();


        var check = function(It, it, params){
            if(it){
                it.initialize(params);
            }
            else{
                it = new It(params)
            }
        };

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showLogin', function(){
            check(LoginView);
        });

        app_router.on('route:showProfile', function(id){
            check(NavbarView, navbar);
            check(HeaderView, viewHeader);
            new ProfileView(id);
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