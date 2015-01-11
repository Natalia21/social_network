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
        },
        events: {
            "click .kill_friend": 'killFriend'
        },
        killFriend: function(e){
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
                ownerModel.save({friends: {id: e.target.id.split('kill')[0]}}, {
                    success: function (model, response) {
                        alert(response.text);
                        $("#" + e.target.id.split('kill')[0]).remove();
                        if($("#my_friends_list")[0] &&  $("#my_friends_list")[0].children.length == 0 && document.URL.indexOf('reference_requests') != -1){
                            var compiledTemplate = _.template('<h2>У вас нет неподтверждённых заявок</h2>');
                            this.$el = $("#content");
                            this.$el.html(compiledTemplate);
                        }
                        if($("#my_friends_list")[0] && $("#my_friends_list")[0].children.length == 0 && document.URL.indexOf('my_friends') != -1){
                            var compiledTemplate = _.template('<h2>У вас пока нет друзей</h2>');
                            this.$el = $("#content");
                            this.$el.html(compiledTemplate);
                        }
                        $("#" + e.target.id).hide();
                        $("#" + e.target.id.split('kill_')[0] + e.target.id.split('kill_')[1]).show();
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });
        }
    });
    return KillFriendView;
})