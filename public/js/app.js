define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'jscookie',
    'router',
    'models/session_model',
    'models/user_model'
], function ($, _, Backbone, io, Jscookie, Router, ModelSession, ModelUser) {
    var initialize = function () {
        App = {
            Models: {},
            Collections: {},
            Views: {},
            Router: {},
            socket: null,
            object: _.extend({}, Backbone.Events),

            initSocket: function () {
                var that = this;
                this.socket = io();
                this.socket.on('connect', function () {
                    that.addUser();
                });
                return this;
            },

            addUser: function () {
                var id = this.session.getUser().get('_id');
                if ( id ) {
                    this.socket.emit('add_user', {'id': id});
                }
            },

            fixCookies: function () {
                Cookies = Jscookie;
                return this;
            },

            getSession: function () {
                return this.session;
            },

            setSession: function (session) {
                this.session = session;
                return this;
            },

            setSessionFromCookie: function () {
                this.session
                    .setAuthenticated(true)
                    .setUser(new ModelUser(JSON.parse(Cookies.get('user'))));
            },

            close: function (view) {
                var that = this;
                if (view) {
                    view.$el.empty();
                    view.unbind();
                    view.undelegateEvents();
                    view.stopListening();
                    _.each(view.socket_events, function (method, key) {
                        if ( ! _.isFunction(method) ) {
                            method = that[method];
                        }
                        App.socket.removeListener(key, method);
                    });
                }                
            }
        };

        App
            .initSocket()
            .fixCookies()
            .setSession(new ModelSession())
            .getSession()
            .setUser(new ModelUser());

        return Router.initialize();
    };

    return {
        initialize: initialize
    };
});