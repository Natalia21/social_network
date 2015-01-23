define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection',
    './requests_owner'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection, RequestsOwner){
    var GetUsersView = Backbone.View.extend({
        initialize: function(){
            var that = this;
            this.$el = $('#content');
            this.$el.html(_.template('<br/> <input type="text" class="form-control" placeholder="Начните вводить имя пользователя…" id = "user_name"> <br/> <div id = "forUL"></div>'));
            App.Collections.users = new UsersCollection();
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.getUsers(owner);
            });
        },
        events: {
            "click .write_msg": 'writeMsg'
        },
        getUsers: function(owner){
            var that = this;
            App.Collections.users.fetch({
                success: function(model, response){
                    var id_to_remove;
                    response.forEach(function(index, index2){
                            if (index._id != owner.id) {
                                model.models[index2].set({
                                    id: index._id,
                                    email: index.email,
                                    first_name: index.first_name,
                                    last_name: index.last_name
                                });
                            }
                            else {
                                id_to_remove = model.models[index2].cid;
                            }
                    });
                    if(id_to_remove){
                        model.remove(id_to_remove);
                    }
                    that.render(owner);
                }
            });
        },
        render: function(owner){
            this.$el = $('#forUL');
            this.$el.html(_.template('<ul class="nav users_list" id = "list"></ul>'));
            this.$el = $('#list');
            var that = this;
            var user_is_friend;
            App.Collections.users.models.forEach(function(index){
                var compiledTemplate = _.template(userListTemplate);
                that.$el.append(compiledTemplate(index.attributes));
                index.attributes.friends.forEach(function(element){
                    if(element.id == owner.get("id") && element.confirm != false){
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