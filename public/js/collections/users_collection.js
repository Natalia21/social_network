define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
],function($, _, Backbone, UserModel){
    var UsersCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users',
        "sync": syncMyCollection
    });
    function syncMyCollection(method, model, options){
        options.url = model.url;
        if(method=='read' && this.filtered_data){
            options.url = model.url + '/' + this.filtered_data;
        }
        return Backbone.sync(method, model, options);
    }
    return UsersCollection;
});
