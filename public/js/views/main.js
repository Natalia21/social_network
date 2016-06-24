define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'toaster'
], function ( $, _, Backbone, io, Toaster) {
    App.Views.Main = Backbone.View.extend({
        initialize: function () {
            var that = this;
            App.socket.on('message_to_user', function (msg) {
                that.showNewMsg(msg);
            });
        },

        bindSockets: function () {
            var that = this;
            _.each(this.socket_events, function (method, key) {
                if ( ! _.isFunction(method) ) {
                    method = that[method];
                }
                method = _.bind(method, that);
                App.socket.on(key, method);
            });
        },

        showNewMsg: function (msg) {
            var name = ' ' + msg.from.first_name + ' ' + msg.from.last_name;
            $.toaster({
                        'priority': 'info',
                        'title':    name,
                        'message':  msg.text,
                        'settings': {
                            'timeout':  5000
                        }
                      });
        }
    });

    return App.Views.Main;
});