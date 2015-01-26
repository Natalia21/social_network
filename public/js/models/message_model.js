define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var MessageModel = Backbone.Model.extend({
        urlRoot: '/message',
        url: '/message'
    });
    return MessageModel;
});
