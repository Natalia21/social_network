define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/all_users',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, AllUsersModel, UsersCollection){

    var GetUsersView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(){
            this.getUsers();
            this.render();
        },
        getUsers: function(){
            App.Collections.users = new UsersCollection();
            App.Collections.users.fetch({
                success: function(model, response){
                    App.Collections.users.set(response);
                }
            })
            console.log(App.Collections.users);
        },
        render: function(){
            this.$el.html(_.template('<ul id = "list"></ul>'));
            this.el = $('#list');
            console.log(App.Collections.users);
            App.Collections.users.models.forEach(function(index){
                console.log(App.Collections.users.models[index]);
                var compiledTemplate = _.template(userListTemplate);
                this.$el.append(compiledTemplate(App.Collections.users.models[index].attributes));
            });
            return this;
        }
    });
    return GetUsersView;
});