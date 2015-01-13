define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    './do_smth_with_user_view',
    './do_smth_with_owner_view'
], function($, _, Backbone, userListTemplate, UserModel, DoSmthWithUserView, DoSmthWithOwnerView){
    var AddFriendView = Backbone.View.extend({
        el: $("#content"),
        initialize: function () {
        },
        events: {
            "click .add_friend": 'addFriend'
        },
        addFriend: function (e) {
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.owner_action.saveOwner(owner, {friends: {id: e.target.id.split('friend')[0], confirm: false, _new: false}});
                that.owner_action.object.once('owner_is_saved', function(params){
                    var owner = params[0];
                    that.user_action = new DoSmthWithUserView();
                    that.user_action.saveUser(e.target.id.split('friend')[0], {friends: {id: owner.get("id"), confirm: null, _new: true}});
                    that.user_action.object.once('user_is_saved', function(user){
                        alert("Вы отправили заявку в друзья пользователю " + user.get("first_name") + " " + user.get("last_name"));
                        $("#" + e.target.id.split('friend')[0] + "friend").hide();
                        $("#" + e.target.id.split('friend')[0] + "kill_friend").show();
                    });
                });
            });
        }
    });
    return AddFriendView;
});