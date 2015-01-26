define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
], function($, _, Backbone, UserModel){
    var RequestsOwner = Backbone.View.extend({
        initialize: function(){
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },
        getOwner: function(){
            var that = this;
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function (model, response) {
                    ownerModel.set({
                        id: response._id,
                        email: response.email,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        friends: response.friends,
                        messages: response.messages
                    });
                    that.object.trigger('owner_is_fetched', ownerModel);
                },
                error: function (model, response) {
                    console.log('error');
                    that.object.trigger('owner_is_absent');
                    console.log(response);
                }
            })
        },

        addFriend: function(owner, params){
            var that = this;
            owner.save(params, {
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
                    }
                    that.object.trigger('owner_is_saved', owner);
                },
                error: function (response) {
                    console.log('in error');
                    console.log(response);
                }
            });
        },


        confirmFriend: function(owner, params){
            var that = this;
            owner.save(params, {
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
                    }
                    that.object.trigger('owner_is_saved', owner);
                },
                error: function (response) {
                    console.log('in error');
                    console.log(response);
                }
            });
        },


        killFriend: function(owner, params){
            var that = this;
            owner.save(params, {
                url: '/kill_friend',
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
                    }
                    that.object.trigger('owner_is_saved', [owner, response]);
                },
                error: function (response) {
                    console.log('in error');
                    console.log(response);
                }
            });
        }

    });
    return RequestsOwner;
});




























