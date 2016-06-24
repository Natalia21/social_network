define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html',
    './main'
], function ($, _, Backbone, HeaderTmpl, MainView) {
    var HeaderView = App.Views.Main.extend({
        template: _.template(HeaderTmpl),
        el:  $('#header'),

        events: {
            'click #search': 'search',
            'click #signOut': 'signOut'
        },

        initialize: function () {
            this.render();
        },

        search: function () {
            Backbone.history.navigate('search', true);
        },

        signOut: function () {
            $.ajax({
                method: 'POST',
                url: '/sign_out',
                success: function () {
                    App.session.setAuthenticated(false).setUser({});
                    Cookies.set('user', '');
                    App.socket.emit('disconnect_user');
                    Backbone.history.navigate('login', true);
                }
            });
        },

        render: function () {
            $(this.el).html(this.template);
            var $friend_navbar = $('.friend_navbar').show();
            if (Backbone.history.location.hash.indexOf('friends') !== -1) {
                $friend_navbar.show();
            } else {
                $friend_navbar.hide();
            }
            return this;
        }
    });

    return HeaderView;
});
