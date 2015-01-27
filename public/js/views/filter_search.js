define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../collections/users_collection',
    './requests_owner'
], function($, _, Backbone, userListTemplate, UsersCollection, RequestsOwner){
    var FilterSearchView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(getUsersView){
            this.getUsersView = getUsersView;
        },
        events: {
            'keyup #user_name': 'Filter'
        },
        Filter: function(e){
            var that = this;
            App.Collections.users = new UsersCollection();
            App.Collections.users.filtered_data = e.target.value;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.getUsersView.getUsers(owner);
            });
        }
    });
    return FilterSearchView;
});