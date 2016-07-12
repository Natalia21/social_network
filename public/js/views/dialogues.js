define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/dialogue.html',
    'text!/templates/dialogues_container.html',
    './user_actions',
    '../models/current_user_model',
    'text!/templates/new_msg_modal.html'
], function ($, _, Backbone, DialogueTmpl, ContainerTmpl, UserActions, CurrentUserModel, ModalTmpl) {
    var DialoguesView = App.Views.UserActions.extend({
        template: _.template(DialogueTmpl),
        modal_tmpl: _.template(ModalTmpl),
        container_template: _.template(ContainerTmpl),

        el:  $('#content'),

        socket_events: {
            'message_to_user': 'getDialogues'
        },

        events: {
            'click .write_msg_btn': 'showMsgModal'
        },

        initialize: function () {
            self = this;
            this.current_user_id = App.session.getUser().get('_id');
            this.bindSockets();
            this.getDialogues();
            this.render();
            App.object.on('msg_is_send', self.getDialogues);
        },

        getDialogues: function () {
            $.ajax({
                method: 'GET',
                url: '/dialogues',
                success: function (data) {
                    self.prepareData(data);
                }
            });
        },

        prepareData: function (dialogues) {
            $('.dialogues ul').empty();
            _.each(dialogues, function (dialogue) {
                var msg = dialogue.msgs[0];
                msg.dialogue_id = dialogue._id;
                msg.time = msg.time.split('T')[1].split('.')[0]; //get time from date
                if ( msg.from._id == self.current_user_id ) {
                    msg.user_name = msg.to.first_name + ' ' + msg.to.last_name;
                    msg.user_id = msg.to._id;
                } else {
                    msg.user_name = msg.from.first_name + ' ' + msg.from.last_name;
                    msg.user_id = msg.from._id;
                }
                self.renderDialogue(msg);
            });
        },

        showMsgModal: function (e) {
            e.stopPropagation();

            if ( ! this.$el.find('#msg_modal').length ) {
                this.$el.append(this.modal_tmpl());
            }

            $modal = $('#msg_modal');
            $send_msg = $('.send_msg');
            $close = $('.close');

            this.showFriendsInSearchBox();

            $send_msg.unbind('click');
            $send_msg.bind('click', {$modal: $modal}, self.sendMsg);

            $close.unbind('click');
            $close.bind('click', function () {
                $modal.modal('hide');
            });

            $modal.modal('show');
            setTimeout(function () {
                $modal.find('input').focus();
            }, 500);
        },

        showFriendsInSearchBox: function () {
            this.user = new CurrentUserModel();
            this.user.fetch({
                success: function (model) {
                    var $input = $('input.recipient_name');
                    $input.on('keyup', self.dinamicSearch);
                    $input.on('click', self.dinamicSearch);
                }
            });
        },

        filterFriends: function (filter_query) {
            var result = [];
            var friends = this.user.get('friends');
            if ( ! filter_query ) {
                return friends;
            }
            friends.every(function (user, i) {
                user.name = user.first_name + ' ' + user.last_name;
                if ( user.name.indexOf(filter_query) !== -1 ) {
                    result.push(user);
                }
                return i < 13;
            });
            return result;
        },

        dinamicSearch: function (e) {
            e.stopPropagation();
            var filter_query = $(e.currentTarget).val().toLowerCase();
            var filtred_friends = self.filterFriends(filter_query);
            var $search_box = $('ul#search_for_recipient');
            $search_box.empty();
            if ( filtred_friends.length ) {
                _.each(filtred_friends, function (friend) {
                    $search_box.append('<li data-id=' + friend._id + '>' + friend.first_name + ' ' + friend.last_name + '</li>');
                });
                $search_box.show();
                $search_box.find('li').bind('click', function (e) {
                    var $input = $('input.recipient_name');
                    $input.val(e.currentTarget.innerText);
                    $input.attr('data-id', $(e.currentTarget).attr('data-id'));
                });
            }
        },

        renderDialogue: function (msg) {
            $('.dialogues ul').append(this.template({
                id: msg.dialogue_id,
                user_name: msg.user_name,
                user_id: msg.user_id,
                msg: msg.text,
                time: msg.time
            }));

            var $you = $('.dialogue_in_dialogues:last-child .you');
            if ( msg.from._id ==  this.current_user_id ) {
                $you.show();
            } else {
                $you.hide();
            }
            $('#dialogues').addClass('active');
        },

        render: function () {
            this.$el.html(this.container_template());
        }
    });

    return DialoguesView;
});
