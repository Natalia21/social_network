define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/my_friends.html',
    'text!/templates/info_msg.html',
    'text!/templates/friends_container.html',
    '../models/current_user_model',
    './user_actions'
], function ($, _, Backbone, MyFriendsTmpl, InfoMsgTmpl, FriendsContainerTmpl, CurrentUserModel, UserActions) {
    var MyFriendsView = App.Views.UserActions.extend({

        my_friends_tmpl: _.template(MyFriendsTmpl),
        info_msg_tmpl: _.template(InfoMsgTmpl),
        friends_container_tmpl: _.template(FriendsContainerTmpl),

        el:  $('#content'),

        events: {
            'click .add_friend': 'addFriend',
            'click .kill_friend': 'removeFriend',
            'click .write_msg': 'showMsgModal'
        },

        initialize: function (status) {
            self = this;
            this.status = status;
            this.model = new CurrentUserModel();
            this.getMyFriends();
        },

        getMyFriends: function () {
            var data = [];

            this.model.fetch({
                success: function () {
                    switch (self.status) {
                        case '1':
                            data = self.model.get('friends');
                            break;
                        case '2':
                            data = self.model.get('subscriptions');
                            break;
                        case '3':
                            data = self.model.get('followers');
                            break;
                    }
                    if ( ! data.length ) {
                        return self.renderMsg();
                    }
                    self.render(data);
                },
                error: function (model, res) {
                    console.log('error', res);
                }
            });
        },

        addFriend: function (e) {
            var $users_list = $('.users_list');
            var $add_btn = $(e.currentTarget);
            var $user_row = $add_btn.parent();
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('h3').text());

            this.postFriend(id)
                .success(function () {
                    alert('Вы и ' + name + ' теперь друзья.');
                    $user_row.remove();
                    if ( $users_list.find('li').length ) {
                        self.renderMsg();
                    }
                })
                .error(function (error) {
                    console.log('error', error);
                });
        },

        removeFriend: function (e) {
            var $users_list = $('.users_list');
            var $remove_btn = $(e.currentTarget);
            var $user_row = $remove_btn.parent();
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('h3').text());

            this.deleteFriend(id)
                .success(function () {
                    alert('Вы удалили ' + name + ' из друзей.');
                    $user_row.remove();
                    if ( ! $users_list.find('li').length ) {
                        self.renderMsg();
                    }
                })
                .error(function (error) {
                    console.log('error', error);
                });
        },

        renderMsg: function () {
            this.$el.html(this.info_msg_tmpl({status: this.status}));
        },

        render: function (users) {
            this.$el.html(this.friends_container_tmpl());

            var friendsContainer = $('#my_friends_list');

            _.each(users, function (user) {
                friendsContainer.append(self.my_friends_tmpl(user));
            });

            if ( this.status.match(/^[1-2]$/) ) {
                $('.add_friend').hide();
            } else {
                $('.kill_friend').hide();
            }
        }
    });

    return MyFriendsView;
});
