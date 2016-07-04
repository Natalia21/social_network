define([
    'jquery',
    'underscore',
    'backbone',
    'toaster'
], function ( $, _, Backbone, Toaster) {
    App.Views.Main = Backbone.View.extend({
        initialize: function () {
            self = this;
            App.socket.on('message_to_user', function (msg) {
                self.showNewMsg(msg);
            });
        },

        bindSockets: function () {
            _.each(this.socket_events, function (method, key) {
                if ( ! _.isFunction(method) ) {
                    method = self[method];
                }
                App.socket.on(key, method);
            });
        },

        showNewMsg: function (msg) {
            var name = ' ' + msg.from.first_name + ' ' + msg.from.last_name;
            $.toaster({
                priority: 'info',
                title: name,
                message: msg.text,
                settings: {
                    'timeout':  5000
                }
            });
        }
    });

    return App.Views.Main;
});
