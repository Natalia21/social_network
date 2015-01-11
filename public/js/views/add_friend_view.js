define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection){
    var AddFriendView = Backbone.View.extend({
        el: $("#content"),
        initialize: function () {
        },
        events: {
            "click .add_friend": 'addFriend'
        },
        addFriend: function (e) {
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function (model, response) {
                    if (response[0]) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
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
                ownerModel.save({friends: {id: e.target.id.split('friend')[0], confirm: false, _new: false}}, {
                    success: function (model, response) {
                        var getUserById = new UserModel({id: e.target.id.split('friend')[0]});
                        getUserById.save({friends: {id: ownerModel.get("id"), confirm: null, _new: true}}, {
                            success: function (model, response) {
                                if (response[0]) {
                                    model.set({
                                        id: response[0]._id,
                                        email: response[0].email,
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
        }
    });
    return AddFriendView;
});