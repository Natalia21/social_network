define([
    'jquery',
    'underscore',
    'backbone',
    '../models/message_model'
],function($, _, Backbone, MessageModel){
    var MessagesCollection = Backbone.Collection.extend({
        model: MessageModel,
        url: '/messages/',
        "sync": syncMyCollection
    });
    function syncMyCollection(method, model, options){
        options.url = model.url;
        console.log(this.id1)
        if(method=='read' && this.id1){
            options.url = model.url + this.id1;
        }
        if(method=='read' && this.coef && this.id1 && this.id2){
            options.url = model.url + this.id1 + '/' + this.id2 + '/' + this.coef;
        }
        return Backbone.sync(method, model, options);
    }
    return MessagesCollection;
});