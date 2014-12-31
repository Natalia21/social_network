define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection){
    var KillFriendView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
          console.log('in initialize kill')
        },
        events: {
            "click .kill_friend": 'killFriend'
        },
        killFriend: function(e){
            console.log('in kill_friend')
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
                ownerModel.save({friends: {id: e.target.id.split('kill')[0]}}, {
                    success: function (model, response) {
                        alert(response.text);
                        $("#" + e.target.id.split('kill')[0]).remove();
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });

            });
        }
    });
    return KillFriendView;
});