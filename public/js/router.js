define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'login': 'login',
            'signUp': 'signUp',
            'profile/:id': 'profile',
            'friends/:status': 'friends',
            'search': 'usersSearchResult',
            'messages': 'messages',
            'messages/:id': 'dialogue',
            '*actions': 'profile'
        },

        views: {
            navbar: null,
            current: null,
            header: null
        },

        route: function (route, name, callback) {
            if ( ! _.isRegExp(route) ) {
                route = this._routeToRegExp(route);
            }
            if ( _.isFunction(name) ) {
                callback = name;
                name = '';
            }
            if ( ! callback ) {
                callback = this[name];   
            }

            var router = this;

            Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                var go_to_route = router.before.apply(router, arguments);
                if ( arguments[0] === go_to_route ) {
                    callback && callback.apply(router, args);
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                }
            });
            return this;
        },

        login: function () {
            var that = this;
            require(['views/login'], function (LoginView) {
                that.views.current = new LoginView();
            });
        },

        signUp: function () {
            var that = this;
            require(['views/sign_up'], function (SignUpView) {
                that.views.current = new SignUpView();
            });
        },

        profile: function (id) {
            var that = this;
            require(['views/profile'], function (ProfileView) {
                that.views.current = new ProfileView(id);
                that.navbar();
                that.header();
            });
        },

        friends: function (status) {
            if ( ! status.match(/^[1-3]$/)) {
                this.navigate('profile', true);
            }
            var that = this;
            require(['views/my_friends'], function (FriendsView) {
                that.views.current = new FriendsView(status);
                that.navbar();
                that.header();
            });
        },

        usersSearchResult: function () {
            var that = this;
            require(['views/users'], function (UsersView) {
                that.views.current = new UsersView();
                that.navbar();
                that.header();
            });
        },

        messages: function () {
            var that = this;
            require(['views/dialogues'], function (MessagesView) {
                that.views.current = new MessagesView();
                that.navbar();
                that.header();
            });
        },

        dialogue: function (id) {
            var that = this;
            require(['views/one_dialogue'], function (DialogueView) {
                that.views.current = new DialogueView(id);
                that.navbar();
                that.header();
            });
        },

        navbar: function () {
            var that = this;
            require(['views/navbar'], function (NavbarView) {
                that.views.navbar = new NavbarView();
            });
        },

        header: function () {
            var that = this;
            require(['views/header'], function (HeaderView) {
                that.views.header = new HeaderView();
            });
        },

        before: function (route, params) {
            _.each([this.views.current, 
                    this.views.navbar, 
                    this.views.header], 
                    App.close
                );
            if (Cookies.get('user') && ! App.session.isAuthenticated()) {
                App.setSessionFromCookie();
            }

            if ( ! App.session.isAuthenticated() && route !== 'signUp') {
                this.navigate('login', true);
                return 'login';
            }
            return route;
        }
    });

    var initialize = function () {
        require(['views/main'], function (MainView) {
            new MainView();
        });
        App.Router.Main = new AppRouter();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
