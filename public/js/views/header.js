define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html',
    'text!/templates/search_user_entry.html',
    '../collections/users_collection',
    './user_actions'
], function ($, _, Backbone, HeaderTmpl, SearchUserEntryTmpl, UsersCollection, UserActions) {
    var HeaderView = App.Views.UserActions.extend({

        template: _.template(HeaderTmpl),
        search_tmpl: _.template(SearchUserEntryTmpl),

        el:  $('#header'),

        events: {
            'keyup #search': 'search',
            'click #search': 'search',
            'click .add_friend': 'addFriend',
            'click .kill_friend': 'removeFriend',
            'click .write_msg': 'showMsgModal',
            'click #search_result li': 'navigateToProfile',
            'click .log_out': 'logOut'
        },

        initialize: function () {
            that = this;
            this.setUserId();
            this.users_collection = new UsersCollection();
            $('body').bind('click', this.closeSearchBox);
            this.render();
        },

        setUserId: function () {
            this.user_id = null;
            if ( App.session.isAuthenticated() ) {
                this.user_id = App.session.getUser().get('_id');
            }
        },

        isUserAFriend: function (user) {
            return user.get('is_a_friend') || user.get('is_in_subscriptions');
        },

        addFriend: function (e) {
            e.stopPropagation();
            var $add_btn = $(e.currentTarget);
            var $user_row = $add_btn.closest('li');
            var $remove_btn = $user_row.find('.kill_friend');
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('.user_name').text());

            if ( ! App.session.isAuthenticated() ) {
                alert('Log in to add ' + name + ' to friends');
                return;
            }

            this.postFriend(id)
                .success(function () {
                    alert('Вы отправили заявку в друзья пользователю ' + name);
                    $add_btn.hide();
                    $remove_btn.show();
                })
                .error(function (error) {
                    console.log('error', error);
                });
        },

        removeFriend: function (e) {
            e.stopPropagation();
            var $remove_btn = $(e.currentTarget);
            var $user_row = $remove_btn.closest('li');
            var $add_btn = $user_row.find('.add_friend');
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('.user_name').text());

            this.deleteFriend(id)
                .success(function () {
                    alert('Вы удалили ' + name + ' из друзей.');
                    $add_btn.show();
                    $remove_btn.hide();
                })
                .error(function (error) {
                    console.log('error', error);
                });          
        },

        renderUsers: function (users) {
            var $container = $('#search_result').empty();
            _.each(users, function (user) {
                $container.append(that.search_tmpl({user: user.attributes}));
                var $current_row = $container.find('li:last-child');
                var $add_btn = $current_row.find('.add_friend');
                var $remove_btn = $current_row.find('.kill_friend');

                if ( that.isUserAFriend(user) ) {
                    $add_btn.hide();
                } else {
                    $remove_btn.hide();
                }
            });
            $container.show();
        },

        closeSearchBox: function (e) {
            $('#search_result').empty().hide();
        },

        navigateToProfile: function (e) {
            var id = $(e.currentTarget).data('id');
            Backbone.history.navigate('profile/' + id, true);
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

            if ( ! App.session.isAuthenticated() ) {
                $('nav').hide();
                $('.log_out').hide();
                $signup.show();
                $login.show();
                if ( route.indexOf('login') !== -1 ) {
                    $login.hide();
                } 
                if ( route.indexOf('signup') !== -1 ) {
                    $signup.hide();
                }
            } else {
                $('nav').show();
                $('.log_out').show();
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
