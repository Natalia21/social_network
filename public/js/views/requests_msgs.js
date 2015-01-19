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
                    console.log('success')
                    console.log(response);
                    console.log(model);
                     /*  model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends,
                            messages: response[0].messages
                        });*/
                  that.object.trigger('msgs_is_fetched', model);

                },
                error: function (model, response) {
                    console.log(response);
                    that.object.trigger('msgs_is_absent');
                }
            })
        }
    });
    return RequestsMsgs;
});




























