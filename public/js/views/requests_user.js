define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
], function($, _, Backbone, UserModel){
    var RequestsUser = Backbone.View.extend({
        initialize: function(){
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },

        loginUser: function(email, password){
            var that  = this;
            var userModel = new UserModel();
            userModel.login({
                email: email,
                password: password
            }).success(function (model) {
                if(!model.text){
                    userModel.set({
                        id: model._id,
                        email: model.email,
                        password: '',
                        first_name: model.first_name,
                        last_name: model.last_name,
                        friends: model.friends,
                        messages: model.messages
                    });
                    that.object.trigger('user_is_logined', userModel);
                }
                else{
                    that.object.trigger('user_is_logined', model);
                }
            }).error(function (model, response) {
                console.log('in error login');
                console.log(response);
            });
        },


        getUser: function(id){
            var that = this;
            var userModel = new UserModel({
                id: id
            });
            userModel.fetch({
                success: function(model, response){
                    if(response.length){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends,
                            messages: response[0].messages
                        });
                        that.object.trigger('user_is_fetched', userModel);
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            })
        },


        newUser: function(params){
            var that = this;
            var userModel = new UserModel(params);
            userModel.save({contentType: "application/json"}, {
                success: function (model, response) {
                    if (response.length) {
                        model.set({id: response[0]._id, password: ''});
                        that.object.trigger('user_is_new', userModel);
                    }
                },
                error: function (model, response) {
                    console.log('in error');
                    alert(response.responseText);
                }
            });
        },


        addFriend: function(id, params){
            var that = this;
            var userModel = new UserModel({
                id: id
            });
            userModel.save(params, {
                url: '/add_friend',
                success: function (model, response) {
                    if (response.length) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends,
                            messages: response[0].messages
                        });
                        that.object.trigger('user_is_saved', userModel);
                    }
                },
                error: function (model, response) {
                    console.log('in error');
                    console.log(response);
                }
            });
        },


        confirmFriend: function(id, params){
            var that = this;
            var userModel = new UserModel({
                id: id
            });
            userModel.save(params, {
                url: '/confirm_friend',
                success: function (model, response) {
                    if (response.length) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends,
                            messages: response[0].messages
                        });
                        that.object.trigger('user_is_saved', userModel);
                    }
                },
                error: function (model, response) {
                    console.log('in error');
                    console.log(response);
                }
            });
        }

    });
    return RequestsUser;
});




























