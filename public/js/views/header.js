define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html',
    'text!/templates/search_user_entry.html',
    '../collections/users_collection',
    './main'
], function ($, _, Backbone, HeaderTmpl, SearchUserEntryTmpl, UsersCollection, MainView) {
    var HeaderView = App.Views.Main.extend({

        template: _.template(HeaderTmpl),
        search_tmpl: _.template(SearchUserEntryTmpl),

        el:  $('#header'),

        events: {
            'keyup #search': 'search',
            'click #search': 'search',
            'click .log_out': 'logOut'
        },

        initialize: function () {
            that = this;
            this.user_id = App.session.getUser().get('_id');
            this.users_collection = new UsersCollection();
            this.render();
        },

        renderUsers: function (users) {
            var $container = $('#search_result').empty();
            _.each(users, function (user) {
                $container.append(that.search_tmpl({user: user}));
            });
            $container.show();
        },

        search: function (e) {
            var filter_query = $(e.currentTarget).val().toLowerCase();
            var $search_result = $('#search_result');
            var search_params = {
                limit: 12,
                filter: filter_query
            };

            this.users_collection.fetch({
                data: $.param(search_params),
                success: function (data) {
                    if ( data && data.models.length ) {
                        that.renderUsers(data.models);
                    } else {
                        $search_result.empty().hide();
                    }
                }
            });
        },

        logOut: function () {
            $.ajax({
                method: 'GET',
                url: '/sign_out',
                success: function () {
                    App.session.setAuthenticated(false).setUser({});
                    Cookies.set('user', '');
                    App.socket.emit('disconnect_user');
                    Backbone.history.navigate('login', true);
                }
            });
        },

        setClassBasedOnRoute: function () {
            var route = Backbone.history.fragment;
            var $login = $('.log_in');
            var $signup = $('.sign_up');

            if ( route.indexOf('profile') !== -1 ) {
                $('#profile').addClass('active');
            }
            if ( route.indexOf('friends') !== -1 ) {
                if ( route.indexOf('1') !== -1 ) {
                    $('#friends').addClass('active');
                } else {
                    $('#followers').addClass('active');
                }
            }
            if ( route.indexOf('dialogues') !== -1 ) {
                $('#dialogues').addClass('active');
            }

            if ( route.indexOf('login') !== -1 || route.indexOf('signUp') !== -1) {
                $('nav').hide();
                $('.log_out').hide();
                if ( route.indexOf('login') !== -1 ) {
                    $signup.show();
                    $login.hide();
                } else {
                    $login.show();
                    $signup.hide();
                }
            } else {
                $signup.hide();
                $login.hide();
            }
        },

        render: function () {
            $(this.el).html(this.template({id: this.user_id}));
            this.setClassBasedOnRoute();
            return this;
        }
    });

    return HeaderView;
});
