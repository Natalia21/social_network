define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
], function($, _, Backbone, UserModel){
    var DoSmthWithUserView = Backbone.View.extend({
        initialize: function(){
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },

        loginUser: function(email, password){
            var that  = this;
            var userModel = new UserModel({
                email: email,
                password: password
            });
            App.Models.current_user = userModel;
            userModel.fetch({
                success: function (model, response) {
                    if (response[0]) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            password: '',
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends,
                            messages: response[0].messages
                        });
                    }
                    that.object.trigger('user_is_logined', [userModel, response]);
                },
                error: function (model, response) {
                    console.log(response);
                }
            })
        },
        getUser: function(id){
            var that = this;
            var userModel = new UserModel({
                id: id
            });
            App.Models.current_user = userModel;
            userModel.fetch({
                success: function(model, response){
                    if(response[0]){
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
            App.Models.current_user = userModel;
            userModel.save({contentType: "application/json"}, {
                success: function (model, response) {
                    if (response[0]) {
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
        saveUser: function(id, params){
            var that = this;
            var userModel = new UserModel({
                id: id
            });
            App.Models.current_user = userModel;
            userModel.save(params, {
                success: function (model, response) {
                    if (response[0]) {
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
    return DoSmthWithUserView;
});




























