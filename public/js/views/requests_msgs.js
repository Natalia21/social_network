define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/message_collection'
], function($, _, Backbone, MsgCollection){
    var RequestsMsgs = Backbone.View.extend({
        initialize: function(){
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },
        getMsgs: function(id1, id2, coef){
            var that = this;
            App.Collections.messages = new MsgCollection();
            App.Collections.messages.coef = coef;
            App.Collections.messages.id1 = id1;
            App.Collections.messages.id2 = id2;
            App.Collections.messages.fetch({
                success: function (model, response) {
                    if(response.length){
                        var objs = [];
                        if(typeof response[0] == 'string'){
                            response.forEach(function(index){
                                objs.push(JSON.parse(index));
                            });
                            model.set(objs);
                        }
                        else{
                            model.set(response);
                        }
                        that.object.trigger('msgs_is_fetched', model);
                    }
                    else{
                        that.object.trigger('msgs_is_absent');
                    }

                },
                error: function (model, response) {
                    console.log('error');
                    console.log(response);
                }
            })
        }
    });
    return RequestsMsgs;
});




























