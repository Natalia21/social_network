define([
    'jquery',
    'underscore',
    'backbone',
    '../models/friend_model'
],function($, _, Backbone, FriendModel){
    var FriendsCollection = Backbone.Collection.extend({
        model: FriendModel,
        url: '/friends',
        "sync": syncFriendModel

    });
    function syncFriendModel(method, collection, options){
        options.url = collection.url;
        console.log(collection);
        if(method=='read'){
            options.url = collection.url + '/' + collection.models[0].get('confirm') + '/' + collection.models[0].get('from') + '/' + collection.models[0].get('to');
        }
        return Backbone.sync(method, collection, options);
    }
    return FriendsCollection;
});