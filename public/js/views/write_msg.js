define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/write_msg.html',
    './requests_user'
], function($, _, Backbone, io, writeMsgTemplate, RequestsUser){
    var WriteMsgView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(socket_is_ready_obj){
            this.socket_is_ready_obj = socket_is_ready_obj;
            this.catchEvent();
            this.user_obj = {};
            _.extend(this.user_obj, Backbone.Events);
        },
        events: {
            "click .write_msg": 'writeMsg',
            "click .close": function(){
                $('.msg_box').hide();
                $('#wrap').hide();
            },
            "click #submit_msg": 'sendMsg',
            "click #submit_msg_in_dialogue": 'sendMsgInDialogue'
        },
        catchEvent: function(){
            var that = this;
            this.socket_is_ready_obj.on('socket_is_ready', function(socket){
                that.socket = socket;
            });
        },
        render: function(user){
            $(".msg_box").remove();
            this.$el = $('#content');
            var compiledTemplate = _.template(writeMsgTemplate);
            this.$el.append(compiledTemplate(user));
            return this;
        },
        sendMsg: function(){
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0)
                return;
            this.socket.emit("message_to_server", {message: text, to: this.user.get("id")});
            setTimeout( function() {
                $('.msg_box').hide();
                $('#wrap').hide();
                alert('Ваше сообщение пользователю ' + that.user.get("first_name") + ' ' + that.user.get("last_name") + ' отправлено');
            } , 500)
        },
        sendMsgInDialogue: function(){
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0){
                return;
            }
            this.socket.emit("message_to_server", {
                message: text,
                to: document.URL.split('/')[document.URL.split('/').length - 1]
            });
            $("#text").val('');
        },
        writeMsg: function(e){
            this.user_action = new RequestsUser();
            this.user_action.getUser(e.target.id.split('msg')[0]);
            this.user_action.object.once('user_is_fetched', function(user) {
                that.user = user;
                that.user_obj.trigger('user_is_ready', user);
            });
            var that = this;
            this.user_obj.once('user_is_ready', function(user){
                that.render({name: user.get("first_name") + " " + user.get("last_name")});
                $('.msg_box').show();
                $('#wrap').show();
            });
        }
    });
    return WriteMsgView;
});