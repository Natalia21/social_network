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
            App.Models.current_user = ownerModel;
            ownerModel.fetch({
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
                        that.object.trigger('owner_is_fetched', ownerModel);
                    }
                    else{
                        that.object.trigger('owner_is_absent');
                    }
                },
                error: function (model, response) {
                    console.log(response);
                }
            })
        },
        saveOwner: function(owner, params){
            var that = this;
            owner.save(params, {
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




























