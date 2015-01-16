define([
    'jquery',
    'underscore',
    'backbone',
    '../models/friend_model',
    '../collections/friends_collection'
], function($, _, Backbone, FriendModel, FriendsCollection){
    var FriendsRequestsView = Backbone.View.extend({
        initialize: function(){
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },
        newFriend: function(params){
            var that = this;
            var friendModel = new FriendModel(params);
            friendModel.save({
                success: function (model, response) {
                    if (response[0]) {
                        that.object.trigger('friend_is_added', friendModel);
                    }
                },
                error: function (model, response) {
                    console.log('in error');
                    alert(response.responseText);
                }
            });
        },
        getFriends: function(params){
            var that = this;
            App.Collections.friends = new FriendsCollection(params);
            App.Collections.friends.fetch({
                success: function(model, response){
                    response.forEach(function(index, index2){
                        model.models[index2].set({
                            confirm: index.confirm,
                            from: index.from,
                            to: index.to
                        });
                    });
                    if(response.length){
                        that.object.trigger('friends_are_got', App.Collections.friends);
                    }
                    else{
                        that.object.trigger('friends_are_absent');
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            })
        }

    });
    return FriendsRequestsView;
});




























