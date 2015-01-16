define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../models/friend_model',
    './requests_user',
    './requests_owner',
    './requests_friends'
], function($, _, Backbone, userListTemplate, UserModel, FriendModel, DoSmthWithUserView, DoSmthWithOwnerView, RequestsFriends){
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
                that.friend_request = new RequestsFriends();
                that.friend_request.newFriend({
                    from: owner.get("id"),
                    to: e.target.id.split('friend')[0],
                    confirm: false
                });
            });
            this.user_action = new DoSmthWithUserView();
            this.user_action.getUser(e.target.id.split('friend')[0]);
            this.user_action.object.once('user_is_fetched', function(user){
                alert("Вы отправили заявку в друзья пользователю " + user.get("first_name") + " " + user.get("last_name"));
                $("#" + e.target.id.split('friend')[0] + "friend").hide();
                $("#" + e.target.id.split('friend')[0] + "kill_friend").show();
            });
        }
    });
    return AddFriendView;
});
















