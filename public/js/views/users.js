define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/search.html',
    'text!/templates/users_list.html',
    '../collections/users_collection',
    '../models/current_user_model',
    './user_actions'
], function ($, _, Backbone, SearchTmpl, UserListTmpl, UsersCollection, CurrentUserModel, UserActions) {
    var GetUsersView = App.Views.UserActions.extend({

        user_list_tmpl: _.template(UserListTmpl),
        search_tmpl: _.template(SearchTmpl),

        el: $('#content'),

        events: {
            'keyup #user_name': 'filter',
            'click .add_friend': 'addFriend',
            'click .kill_friend': 'removeFriend',
            'click .write_msg': 'showMsgModal'
        },

        initialize: function () {
            this.render();
            this.users_collection = new UsersCollection();
            this.current_user_model = new CurrentUserModel();
            this.getUsers();
        },

        filter: function (e) {
            var that = this;
            var filtered_data = $(e.currentTarget).val().toLowerCase();
            var filtred_users = this.users_collection.search(filtered_data);
            this.renderUsers(filtred_users._wrapped || filtred_users.models);
        },

        getUsers: function () {
            var that = this;
            this.users_collection.fetch({
                success: function (response) {
                    that.renderUsers(that.users_collection.models);
                }
            });
        },

        addFriend: function (e) {
            var that = this;
            var $add_btn    = $(e.currentTarget),
                $user_row   = $add_btn.parent(),
                $remove_btn = $user_row.find('.kill_friend');
            var id   = $user_row.data('id'),
                name = $.trim($user_row.find('h3').text());

            this.postFriend(id)
                .success(function (response) {
                    alert("Вы отправили заявку в друзья пользователю " + name);
                    $add_btn.hide();
                    $remove_btn.show();
                })
                .error(function (error) {
                    console.log('error', error);
                });
        },

        removeFriend: function (e) {
            var $remove_btn = $(e.currentTarget),
                $user_row   = $remove_btn.parent(),
                $add_btn    = $user_row.find('.add_friend');
            var id   = $user_row.data('id'),
                name = $.trim($user_row.find('h3').text());

            this.deleteFriend()
                .success(function (response) {
                    alert("Вы удалили " + name + " из друзей.");
                    $add_btn.show();
                    $remove_btn.hide();
                })
                .error(function (error) {
                    console.log('error', error);
                });          
        },

        isUserAFriend: function (user) {
            return user.get('is_a_friend') || user.get('is_in_subscriptions');
        },

        renderUsers: function (users) {
            var that = this;
            var users_container = $('#list').empty();

            _.each(users, function (user) {
                users_container.append(that.user_list_tmpl(user.attributes));

                var $current_row = users_container.find('li:last-child'),
                    $add_btn = $current_row.find('.add_friend'),
                    $remove_btn = $current_row.find('.kill_friend');

                if ( that.isUserAFriend(user) ) {
                    $add_btn.hide();
                } else {
                    $remove_btn.hide();
                }

            });

            return this;
        },

        render: function (owner) {
            $(this.el).html(this.search_tmpl());
        }
    });

    return GetUsersView;
});
