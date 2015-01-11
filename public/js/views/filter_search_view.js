define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection',
    './get_users_view'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection, GetUsersView){
    var FilterSearchView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(getUsersView){
            console.log('in filter search initialize ');
            this.getUsersView = getUsersView;
            console.log(this.getUsersView);
        },
        events: {
            "keyup #user_name": 'Filter'
        },
        Filter: function(e){
            console.log(e.target.value);
            App.Collections.users = new UsersCollection();
            App.Collections.users.filtered_data = e.target.value.toLowerCase();
            this.getUsersView.getUsers();
        }
    });
    return FilterSearchView;
});