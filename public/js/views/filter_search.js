define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection',
    './actions_with_owner'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection, DoSmthWithOwnerView){
    var FilterSearchView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(getUsersView){
            this.getUsersView = getUsersView;
        },
        events: {
            "keyup #user_name": 'Filter'
        },
        Filter: function(e){
            var that = this;
            App.Collections.users = new UsersCollection();
            App.Collections.users.filtered_data = e.target.value.toLowerCase();
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.getUsersView.getUsers(owner);
            });
        }
    });
    return FilterSearchView;
});