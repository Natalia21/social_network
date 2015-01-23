define([
    'jquery',
    'underscore',
    'backbone',
    './requests_user',
    './requests_owner'
], function($, _, Backbone, RequestsUser, RequestsOwner){
    var AddFriendView = Backbone.View.extend({
        el: $("#content"),
        initialize: function () {
        },
        events: {
            "click .add_friend": 'addFriend'
        },
        render: function(user, e){
            alert("Вы отправили заявку в друзья пользователю " + user.get("first_name") + " " + user.get("last_name"));
            $("#" + e.target.id.split('friend')[0] + "friend").hide();
            $("#" + e.target.id.split('friend')[0] + "kill_friend").show();
        },
        addFriend: function (e) {
            var that = this;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.owner_action.saveOwner(owner, {friends: {id: e.target.id.split('friend')[0], confirm: false, _new: false}});
                that.owner_action.object.once('owner_is_saved', function(params){
                    var owner = params[0];
                    that.user_action = new RequestsUser();
                    that.user_action.saveUser(e.target.id.split('friend')[0], {friends: {id: owner.get("id"), confirm: null, _new: true}});
                    that.user_action.object.once('user_is_saved', function(user){
                        that.render(user, e);
                    });
                });
            });
        }
    });
    return AddFriendView;
});