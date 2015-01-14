define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/write_msg.html',
    'text!/templates/one_dialogue.html',
    '../models/user_model',
    './actions_with_user',
    './actions_with_owner'
], function($, _, Backbone, io, writeMsgTemplate, DialogueTemplate, UserModel, DoSmthWithUserView, DoSmthWithOwnerView){
    var WriteMsgView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(socket_is_ready_obj){
            var that = this;
           // this.getSocket();
            this.socket_is_ready_obj = socket_is_ready_obj;
            this.catchEvent();
          //  this.sign_out_object = {};
           // this.socket_is_ready_obj = {};
            this.user_obj = {};
       //     _.extend(this.sign_out_object, Backbone.Events);
          //  _.extend(this.socket_is_ready_obj, Backbone.Events);
            _.extend(this.user_obj, Backbone.Events);

       /*     this.sign_out_object.on("sign_out", function(){
                console.log('emit disconnect');
                that.socket.disconnect();
               // that.socket.emit('disconnecting');
           //     that.socket = null;
           //     that.catchEvent();
            });*/
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
            this.socket_is_ready_obj.once('socket_is_ready', function(socket, owner){
                that.socket = socket;
                console.log('socket_is_ready');
                socket.on('message_to_me', function (message) {
                    console.log('i got msg to me');
                    that.buildView(owner, message);
                });
                socket.on('message_to_user', function (message) {
                    console.log('i got msg to user');
                    that.buildView(owner, message);
                });
            });
            /* this.object = {};
             _.extend(this.object, Backbone.Events);
             var that = this;
             this.object.once("getSocket", function() {
                 that.getSocket();
             });*/
        },
/*        getSocket: function(){
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            var a = this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner) {
                if(that.socket){
                    that.socket.off('message');
                    that.socket = null;
                }
                that.socket = io.connect('http://localhost:8888', {query: 'ID=' + owner.get("id"), 'forceNew':true});
                that.socket_is_ready_obj.trigger('socket_is_ready');
                that.socket.on('message_to_me', function (message) {
                    console.log('i got msg to me');
                    that.buildView(owner, message);
                });
                that.socket.on('message_to_user', function (message) {
                    console.log('i got msg to user');
                    that.buildView(owner, message);
                });
            });
        },*/
        buildView: function(owner, message){
            var that = this;
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
                        that.$el = $('#for_name_and_msg');
                        that.$el.append(compiledTemplate({id: message.from, name: name, msg: message.text}));
                    }
                    else {
                        name = user.get("first_name") + ' ' + user.get("last_name");
                        that.$el = $('#for_name_and_msg');
                        that.$el.append(compiledTemplate({id: message.from, name: name, msg: message.text}));
                    }
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
            /*if(!this.socket){
                this.object.trigger("getSocket");
            }*/
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0){
                return;
            }
       /*     if(!this.socket) {
                this.socket_is_ready_obj.once('socket_is_ready', function (){
                    that.socket.emit("message_to_server", {
                        message: text,
                        to: document.URL.split('/')[document.URL.split('/').length - 1]
                    });
                });
            }

            else{*/
            console.log(this.socket);
            this.socket.emit("message_to_server", {
                message: text,
                to: document.URL.split('/')[document.URL.split('/').length - 1]
            });
          //  }
           $("#text").val('');
        },
        writeMsg: function(e){
            this.user_action = new DoSmthWithUserView();
            this.user_action.getUser(e.target.id.split('msg')[0]);
            this.user_action.object.once('user_is_fetched', function(user) {
                that.user = user;
                that.user_obj.trigger('user_is_ready', user);
            });
           /* if(!this.socket) {
                this.object.trigger("getSocket");
            }*/
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