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
    'views/my_friends_view',
    'views/ref_requests_view',
    'views/new_requests_view',
    'views/kill_friend_view',
    'views/confirm_request_view',
    'views/add_friend_view',
    'views/filter_search_view',
    'views/write_msg_view',
    'views/dialogues_view',
    'views/one_dialogue_view'
], function($, _, Backbone, io, LoginView, RegisteringView, NavbarView, GetUsersView, HeaderView, ProfileView, HeaderViewFriends, MyFriendsView, RefRequestsView, NewRequestsView, KillFriendView, ConfirmRequestView, AddFriendView, FilterSearchView, WriteMsgView, DialoguesView, OneDialogueView){
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
        var app_router = new AppRouter;
        var object_for_filtred_data = {};
        _.extend(object_for_filtred_data, Backbone.Events);
        var getUsersView = null;
        var filtered_data = new FilterSearchView(getUsersView);
        object_for_filtred_data.once("getUsersView", function(getUsersView) {
            filtered_data.initialize(getUsersView);
        });
        var write_msg = new WriteMsgView();
        var sign_out_object = write_msg.sign_out_object;
        new KillFriendView();
        new ConfirmRequestView();
        new AddFriendView();
        var viewHeader = null;
        var viewHeaderFriends = null;
        app_router.on('route:showLogin', function(){
            new LoginView();
        });

        app_router.on('route:defaultAction', function(actions){
            console.log('No route:', actions);
        });

        app_router.on('route:showProfile', function(id){
            new NavbarView();
            if(viewHeader){
                viewHeader.initialize(sign_out_object);
            }
            else{
                viewHeader =  new HeaderView(sign_out_object);
            }
            new ProfileView(id);
        });

        app_router.on('route:showMyFriends', function(id){
            new NavbarView();
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
            new MyFriendsView(id);
        });
        app_router.on('route:showRefReq', function(id){
            new NavbarView();
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
            new RefRequestsView(id);
        });
        app_router.on('route:showOneDialogue', function(id){
            new NavbarView();
            if(viewHeader){
                viewHeader.initialize(sign_out_object);
            }
            else{
                viewHeader =  new HeaderView(sign_out_object);
            }
            new OneDialogueView(id);
        });
        app_router.on('route:showNewReq', function(id){
            new NavbarView();
            if(viewHeaderFriends){
                viewHeaderFriends.initialize(id);
            }
            else{
                viewHeaderFriends =  new HeaderViewFriends(id);
            }
            new NewRequestsView(id);
        });
        app_router.on('route:showDialogues', function(){
            new NavbarView();
            if(viewHeader){
                viewHeader.initialize(sign_out_object);
            }
            else{
                viewHeader =  new HeaderView(sign_out_object);
            }
            new DialoguesView();
        });

        app_router.on('route:showRegistering', function(){
            new RegisteringView();
        });
        app_router.on('route:showUsersList', function(){
            new NavbarView();
            if(viewHeader){
                viewHeader.initialize(sign_out_object);
            }
            else{
                viewHeader =  new HeaderView(sign_out_object);
            }
            getUsersView =  new GetUsersView();
            object_for_filtred_data.trigger("getUsersView", getUsersView);

        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});