define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection',
    './requests_owner',
    './requests_friends'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection, DoSmthWithOwnerView, FriendsRequest){
    var GetUsersView = Backbone.View.extend({
        initialize: function(){
            var that = this;
            this.$el = $('#content');
            this.$el.html(_.template('<br/> <input type="text" class="form-control" placeholder="Начните вводить имя пользователя…" id = "user_name"> <br/> <div id = "forUL"></div>'));
            App.Collections.users = new UsersCollection();
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.getUsers(owner);
            });
        },
        getUsers: function(owner){
            var that = this;
            App.Collections.users.fetch({
                success: function(model, response){
                    var id_to_remove;
                    var index_to_remove;
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
                                index_to_remove = index2;
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
            this.friend_request = new FriendsRequest();
            this.friend_request.getFriends({from: owner.id, to: owner.id, confirm: false});

            this.friend_request.object.on('friends_are_absent', function(){
                App.Collections.users.models.forEach(function(index){
                    var compiledTemplate = _.template(userListTemplate);
                    that.$el.append(compiledTemplate(index.attributes));
                    $("#" + index.attributes.id + "kill_friend").hide();
                });
            });

            this.friend_request.object.on('friends_are_got', function(friends_collection){
                var my_friends = [];
                friends_collection.models.forEach(function(index){
                    if(index.get("from") != owner.id){
                        my_friends.push(index.get("from"));
                    }
                    else{
                        my_friends.push(index.get("to"));
                    }
                });
                App.Collections.users.models.forEach(function(index){
                    var compiledTemplate = _.template(userListTemplate);
                    that.$el.append(compiledTemplate(index.attributes));
                    if(my_friends.indexOf(index.get("id")) != -1){
                        user_is_friend = true;
                    }
                    if(!user_is_friend){
                        $("#" + index.attributes.id + "kill_friend").hide();
                    }
                    else{
                        $("#" + index.attributes.id + "friend").hide();
                    }
                    user_is_friend = false;
                });
            });
            return this;
        }
    });
    return GetUsersView;
});