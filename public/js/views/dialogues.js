define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/dialogue.html',
    './main'
], function ($, _, Backbone, DialogueTmpl, MainView) {
    var DialoguesView = App.Views.Main.extend({
        template: _.template(DialogueTmpl),
        el:  $('#content'),

        socket_events: {
            'message_to_user': 'gotNewMsg'
        },

        initialize: function () {
            self = this;
            this.current_user_id = App.session.getUser().get('_id');
            this.bindSockets();
            this.getDialogues();
        },

        gotNewMsg: function () {
            self.getDialogues();
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
            this.$el.empty();
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

        renderDialogue: function (msg) {
            this.$el.append(this.template({
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
        }
    });

    return DialoguesView;
});
