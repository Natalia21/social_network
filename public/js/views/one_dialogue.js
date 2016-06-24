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

        events: {
            'click #submit_msg_in_dialogue': 'sendMsg'
        },

        initialize: function (id) {
            this.current_user = App.session.getUser();
            this.friend_id = null;
            this.dialogue_id = id;
            this.getDialogue();
            this.render();
        },

        sendMsg: function () {
            var that = this;
            var $text = $('#text');
            var msg = {};
            msg.to = this.friend_id;
            msg.text = $text.val();
            msg.user_id = this.current_user.get('_id');
            msg.user_name = this.current_user.get('first_name') + ' ' + this.current_user.get('last_name');
            var now = new Date(); 
            msg.time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            App.socket.emit('send_msg', msg);
            $text.val('');
            this.renderDialogue(msg);
        },

        getDialogue: function () {
            var that = this;
            $.ajax({
                method: 'GET',
                url:    '/dialogue/' + this.dialogue_id,
                success: function (res) {
                    that.setFriendId(res.participants);
                    that.prepareData(res.msgs);
                }
            });
        },

        setFriendId: function (users) {
            this.friend_id = users[0] == this.current_user.get('_id') ? users[1] : users[0];
        },

        prepareData: function (msgs) {
            var that = this;
            _.each(msgs, function (msg) {
                msg.time = msg.time.split('T')[1].split('.')[0]; //get time from date
                msg.user_name = msg.from.first_name + ' ' + msg.from.last_name;
                msg.user_id = msg.from._id;
                that.renderDialogue(msg);
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
