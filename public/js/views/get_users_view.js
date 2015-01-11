define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection){
    var GetUsersView = Backbone.View.extend({
        initialize: function(){
            this.$el = $('#content');
            this.$el.html(_.template('<br/> <input type="text" class="form-control" placeholder="Начните вводить имя пользователя…" id = "user_name"> <br/> <div id = "forUL"></div>'));
            App.Collections.users = new UsersCollection();
            this.getUsers();
        },
        events: {
            "click .write_msg": 'writeMsg'
        },
        getOwner: function(that){
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name
                        });
                        that.id = model.get("id");
                        that.render();
                    }
                },
                error: function(model,response){
                    console.log(response);
                }
            })
        },
        getUsers: function(){
            var that = this;
            App.Collections.users.fetch({
                success: function(model, response){
                    response.forEach(function(index, index2){
                        model.models[index2].set({
                            id: index._id,
                            email: index.email,
                            first_name: index.first_name,
                            last_name: index.last_name
                        });
                    });
                    that.getOwner(that);
                }
            });
        },
        render: function(){
            this.$el = $('#forUL');
            this.$el.html(_.template('<ul class="nav users_list" id = "list"></ul>'));
            this.$el = $('#list');
            var that = this;
            var user_is_friend;
            App.Collections.users.models.forEach(function(index){
                var compiledTemplate = _.template(userListTemplate);
                that.$el.append(compiledTemplate(index.attributes));
                index.attributes.friends.forEach(function(element){
                    if(element.id == that.id && element.confirm != false){
                        user_is_friend = true;
                    }
                });
                if(!user_is_friend){
                    $("#" + index.attributes.id + "kill_friend").hide();
                }
                else{
                    $("#" + index.attributes.id + "friend").hide();
                }
                user_is_friend = false;
            });
            return this;
        }
    });
    return GetUsersView;
});