define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    './actions_with_user',
    './actions_with_owner'
], function($, _, Backbone, userListTemplate, UserModel, DoSmthWithUserView, DoSmthWithOwnerView){
    var ConfirmRequestView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
        },
        events:{
            'click .confirm_friend': 'confirmFriend'
        },
        confirmFriend: function(e){
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.owner_action.saveOwner(owner, {friends: {id: e.target.id.split('friend')[0], confirm: true, _new: false}});
                that.owner_action.object.once('owner_is_saved', function(params){
                    var owner = params[0];
                    that.user_action = new DoSmthWithUserView();
                    that.user_action.saveUser(e.target.id.split('friend')[0], {friends: {id: owner.id, confirm: true, _new: false}});
                    that.user_action.object.once('user_is_saved', function(user){
                        $("#" + e.target.id.split('friend')[0]).remove();
                        if($("#my_friends_list")[0].children.length == 0){
                            var compiledTemplate = _.template('<h2>У вас нет новых заявок</h2>');
                            that.$el = $("#content");
                            that.$el.html(compiledTemplate);
                        }
                    });
                });
            });
        }
    });
    return ConfirmRequestView;
});