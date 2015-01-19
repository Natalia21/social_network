define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var MessageModel = Backbone.Model.extend({
        urlRoot: '/message',
        url: '/message',
        defaults : {
            from: "",
            to: "",
            text: "",
            time: ""
        }
    });
    return MessageModel;
});
