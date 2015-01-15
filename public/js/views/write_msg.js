define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/write_msg.html',
    'text!/templates/one_dialogue.html',
    'text!/templates/alerts.html',
    '../models/user_model',
    './requests_user'
], function($, _, Backbone, io, writeMsgTemplate, DialogueTemplate, AlertsTemplate, UserModel, DoSmthWithUserView){
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
            this.socket_is_ready_obj.on('socket_is_ready', function(socket, owner){
                that.socket = socket;
                socket.on('message_to_me', function (message) {
                    console.log('message_to_me');
                    that.buildView(owner, message);
                });
                socket.on('message_to_user', function (message) {
                    console.log('message_to_user');
                    that.buildView(owner, message);
                });
            });
        },
        closeAlert: function(e){
            for(var i = 0; i < this.elems.length; i++){
                if(this.elems[i].id == e.target.id){
                    for(var k = i + 1; k < this.elems.length; k++){
                        var current_top = $(this.elems[k]).css('top').split('px')[0];
                        $(this.elems[k]).css('top', parseInt(current_top) - parseInt($('.alert').css('height').split('px')[0]) + 'px');
                    }
                    break;
                }
            }
        },
        createAlert: function(message){
            var that = this;
            var compiledTemplateAlert = _.template(AlertsTemplate);
            this.user_action = new DoSmthWithUserView();
            this.user_action.getUser(message.from);
            this.user_action.object.once('user_is_fetched', function (user) {
                var user_name = user.get("first_name") + ' ' + user.get("last_name");
                var top = $('#header').css('height').split('px')[0];
                var shift = $('.alert').css('height') ? $('.alert').length * $('.alert').css('height').split('px')[0] : 0;
                that.$el = $('#content');
                that.$el.append(compiledTemplateAlert({id: message.from, name: user_name, msg: message.text, time: message.time}));
                that.elems = $(".alert");
                $.when(
                    $(that.elems[that.elems.length - 1])
                        .css('top', $('#header').css('height'))
                        .css('display', 'block')
                        .animate({opacity: 1, top: parseInt(top) + parseInt(shift) + 'px'}, 200)).then(function(){
                        if(that.elems.length > 5){
                            that.elems[0].remove();
                            for(var i = 0; i < that.elems.length; i++){
                                var current_top = $(that.elems[i]).css('top').split('px')[0];
                                $(that.elems[i]).css('top', parseInt(current_top) - parseInt($('.alert').css('height').split('px')[0]) + 'px')
                            }
                        }
                    });
                $(that.elems[that.elems.length - 1]).on('closed.bs.alert', function (e) {
                    that.closeAlert(e);
                });
            });
        },
        buildView: function(owner, message){
            var that = this;
            if(message.to == owner.get("id")){
                this.createAlert(message);
            }
            if(document.URL.indexOf('messages') != -1) {
                this.$el = $('#for_name_and_msg');
                var current_height = $('#for_name_and_msg').css('height');
                var compiledTemplate = _.template(DialogueTemplate);
                var name = '';
                this.user_action = new DoSmthWithUserView();
                this.user_action.getUser(document.URL.split('/')[document.URL.split('/').length - 1]);
                this.user_action.object.once('user_is_fetched', function (user) {
                    if (message.from == owner.get("id")) {
                        name = owner.get("first_name") + ' ' + owner.get("last_name");
                    }
                    if (message.from == user.get("id")) {
                        name = user.get("first_name") + ' ' + user.get("last_name");
                    }
                    if(name){
                        that.$el = $('#for_name_and_msg');
                        that.$el.append(compiledTemplate({id: message.from, name: name, msg: message.text}));
                        that.$el = $('#for_data');
                        var compiledTemplate2 = _.template('<li class = "data_time"><%= time %></li>');
                        that.$el.append(compiledTemplate2({
                            time: message.time
                        }));
                        var new_height = 450 - current_height.split('px')[0];
                        $('#div_for_name_and_msg').css('padding-top', new_height + 'px');
                        $('#div_for_data').css('padding-top', new_height + 'px');
                        var children_name_and_msg = $('#for_name_and_msg').children();
                        var children_date = $('#for_data').children();
                        for (var i = 1; i < children_date.length; i++) {
                            children_date[i].setAttribute('style', 'padding-top: ' + children_name_and_msg[i * 2 - 1].offsetHeight + 'px');
                        }
                        $('#msg_box').animate({"scrollTop": $('#for_name_and_msg').css("height")});
                    }
                });
            }

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
            this.user_action = new DoSmthWithUserView();
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