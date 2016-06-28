define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/one_dialogue.html',
    'text!/templates/dialogue_container.html',
    'text!/templates/new_msg.html',
    './main'
], function ($, _, Backbone, DialogueTmpl, DialogueContainerTmpl, NewMsgTmpl, MainView) {
    var OneDialogueView = App.Views.Main.extend({

        dialogue_tmpl: _.template(DialogueTmpl),
        dialogue_container_tmpl: _.template(DialogueContainerTmpl),
        new_msg_tpml: _.template(NewMsgTmpl),

        el:  $('#content'),

        socket_events: {
            'message_to_user': 'gotNewMsg'
        },

        events: {
            'click #submit_msg_in_dialogue': 'sendMsg'
        },

        initialize: function (id) {
            self = this;
            this.current_user = App.session.getUser();
            this.friend_id = null;
            this.dialogue_id = id;
            this.bindSockets();
            this.getDialogue();
            this.render();
        },

        sendMsg: function () {
            var $text = $('#text');
            var now = new Date(); 

            var msg = {
                'to': this.friend_id,
                'text': $text.val(),
                'user_id': this.current_user.get('_id'),
                'user_name': this.current_user.get('first_name') + ' ' + this.current_user.get('last_name'),
                'time': now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
            };

            App.socket.emit('send_msg', msg);
            $text.val('');
            this.renderDialogue(msg);
            this.scrollItToBottom();
        },

        gotNewMsg: function (msg) {
            var msgs = [];
            msgs.push(msg);
            var isScrollOnBottom = self.isScrollOnBottom();
            self.prepareData(msgs);
            if ( isScrollOnBottom ) {
                self.scrollItToBottom();
            }
        },

        isScrollOnBottom: function () {
            var $msg_block = $('.msgs_here');
            return $msg_block[0].scrollHeight - $msg_block.scrollTop() == $msg_block.outerHeight();
        },

        scrollItToBottom: function () {
            var $msg_block = $('.msgs_here');
            $msg_block.scrollTop($msg_block[0].scrollHeight);
        },

        getDialogue: function () {
            $.ajax({
                method: 'GET',
                url:    '/dialogue/' + this.dialogue_id,
                success: function (res) {
                    self.setFriendId(res.participants);
                    self.prepareData(res.msgs);
                    setTimeout(function () {
                        self.scrollItToBottom();
                    }, 100);
                }
            });
        },

        setFriendId: function (users) {
            this.friend_id = users[0] == this.current_user.get('_id') ? users[1] : users[0];
        },

        prepareData: function (msgs) {
            _.each(msgs, function (msg) {
                msg.time = msg.time.split('T')[1].split('.')[0]; //get time from date
                msg.user_name = msg.from.first_name + ' ' + msg.from.last_name;
                msg.user_id = msg.from._id;
                self.renderDialogue(msg);
            });
        },

        renderDialogue: function (msg) {
            $('.dialogue_container ul').append(this.dialogue_tmpl(msg));
        },

        render: function () {
            this.$el.html(this.dialogue_container_tmpl());
            $('.dialogue_container').append(this.new_msg_tpml());
            return this;
        }
    });

    return OneDialogueView;
});
