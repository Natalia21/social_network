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
            this.status = status;
            this.model = new CurrentUserModel();
            this.getMyFriends();
        },

        getMyFriends: function () {
            var that = this;
            var data = [];

            this.model.fetch({
                success: function (model, response) {
                    switch (that.status) {
                        case '1':
                            data = that.model.get('friends');
                            break;
                        case '2':
                            data = that.model.get('subscriptions');
                            break;
                        case '3':
                            data = that.model.get('followers');
                            break;
                    }
                    if ( ! data.length ) {
                        return that.renderMsg();
                    }
                    that.render(data);
                },
                error: function (model, response) {
                    console.log('error', response);
                }
            });
        },

        addFriend: function (e) {
            var that = this;
            var $user_list = $('.user_list'),
                $add_btn   = $(e.currentTarget),
                $user_row  = $add_btn.parent();
            var id   = $user_row.data('id'),
                name = $.trim($user_row.find('h3').text());

            this.postFriend(id)
                .success(function (response) {
                    alert("Вы и " + name + " теперь друзья.");
                    $user_row.remove();
                    if ( $user_list.empty() ) {
                        that.renderMsg();
                    }
                })
                .error(function (error) {
                    console.log('error', error);
                });
        },

        removeFriend: function (e) {
            var that = this;
            var $user_list  = $('.user_list'),
                $remove_btn = $(e.currentTarget),
                $user_row   = $remove_btn.parent();
            var id   = $user_row.data('id'),
                name = $.trim($user_row.find('h3').text());

            this.deleteFriend()
                .success(function (response) {
                    alert("Вы удалили " + name + " из друзей.");
                    $user_row.remove();
                    if ( $user_list.empty() ) {
                        that.renderMsg();
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
            var that = this;
            this.$el.html(this.friends_container_tmpl());

            var friendsContainer = $('#my_friends_list');

            _.each(users, function (user) {
                friendsContainer.append(that.my_friends_tmpl(user));
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
