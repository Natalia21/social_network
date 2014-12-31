define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection){
    var GetUsersView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(){
            this.$el = $('#content');
            var that = this;
            this.getUsers(that);
        },
        events: {
            "click .add_friend": 'addFriend',
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
                            password: response[0].password,
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
        addFriend: function(e){
            console.log(e.target.id.split('friend')[0])
                var that = this;
                var ownerModel = new UserModel();
                ownerModel.fetch({
                    success: function (model, response) {
                        if (response[0]) {
                            model.set({
                                id: response[0]._id,
                                email: response[0].email,
                                password: response[0].password,
                                first_name: response[0].first_name,
                                last_name: response[0].last_name
                            });
                            this.id = model.get("id");
                        }
                    },
                    error: function (model, response) {
                        console.log(response);
                    }
                }).then(function () {
                    return ownerModel;
                }).then(function () {
                    ownerModel.save({friends: {id: e.target.id.split('friend')[0], confirm: false, _new: false}}, {
                        success: function (model, response) {
                            var getUserById = new UserModel({id: e.target.id.split('friend')[0]});
                            getUserById.save({friends: {id: ownerModel.get("id"), confirm: null, _new: true}}, {
                                success: function (model, response) {
                                    if (response[0]) {
                                        model.set({
                                            id: response[0]._id,
                                            email: response[0].email,
                                            password: response[0].password,
                                            first_name: response[0].first_name,
                                            last_name: response[0].last_name
                                        });
                                        alert("Вы отправили заявку в друзья пользователю " + model.get("first_name") + " " + model.get("last_name"));
                                        $("#" + e.target.id.split('friend')[0] + "friend").hide();
                                        $("#" + e.target.id.split('friend')[0] + "kill_friend").show();
                                    }
                                },
                                error: function (model, response) {
                                    console.log('in error');
                                    console.log(response);
                                }
                            });
                        },
                        error: function (response) {
                            console.log(response);
                        }
                    });

                });
        },
        getUsers: function(that){
            App.Collections.users = new UsersCollection();
            App.Collections.users.fetch({
                success: function(model, response){
                    response.forEach(function(index, index2){
                        model.models[index2].set({
                            id: index._id,
                            email: index.email,
                            password: index.password,
                            first_name: index.first_name,
                            last_name: index.last_name
                        });
                    });
                    that.getOwner(that);
                }
            });
        },
        render: function(){
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