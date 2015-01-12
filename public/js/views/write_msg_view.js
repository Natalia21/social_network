define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/write_msg.html',
    'text!/templates/one_dialogue.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, io, writeMsgTemplate, DialogueTemplate, UserModel, UsersCollection){
    var WriteMsgView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
            var that = this;
            this.catchEvent();
            this.sign_out_object = {};
            _.extend(this.sign_out_object, Backbone.Events);
            this.sign_out_object.on("sign_out", function(){
                that.catchEvent();
            });
            this.socket_is_ready_obj = {};
            _.extend(this.socket_is_ready_obj, Backbone.Events);
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
            this.object = {};
            _.extend(this.object, Backbone.Events);
            var that = this;
            this.object.once("getSocket", function() {
                that.getSocket();
            });
        },
        getSocket: function(){
            console.log('in get socket');
            var that = this;
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name
                        });
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            }).then(function(){
                if(that.socket){
                     that.socket.off('message');
                     that.socket = null;
                }
                that.socket = io.connect('http://localhost:8888', {query: 'ID=' + ownerModel.get("id"), 'forceNew':true});
                that.socket_is_ready_obj.trigger('socket_is_ready');
                that.socket.on('message', function (message) {
                    if(document.URL.indexOf('messages') != -1){
                        that.$el = $('#for_name_and_msg');
                        var current_height = $('#for_name_and_msg').css('height');
                        var compiledTemplate = _.template(DialogueTemplate);
                        var name = '';
                        that.getOwnerModel();
                        that.user_obj.once('user_is_ready', function(){
                            if(message.from == that.ownerModel.get("id")){
                                name = that.ownerModel.get("first_name") + ' ' + that.ownerModel.get("last_name");
                                that.$el = $('#for_name_and_msg');
                                that.$el.append(compiledTemplate({
                                    id: message.from,
                                    name: name,
                                    msg: message.text
                                }));
                            }
                            else{
                                name = that.getUserByIdObj.get("first_name") + ' ' + that.getUserByIdObj.get("last_name");
                                that.$el = $('#for_name_and_msg');
                                that.$el.append(compiledTemplate({
                                    id: message.from,
                                    name: name,
                                    msg: message.text
                                }));
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
                            for(var i = 1; i < children_date.length; i++){
                                children_date[i].setAttribute('style', 'padding-top: ' + children_name_and_msg[i * 2 - 1].offsetHeight + 'px');
                            }
                            $('#msg_box').animate({"scrollTop":$('#for_name_and_msg').css("height")});
                        });

                    }
                });

            });
        },
        render: function(user){
            $(".msg_box").remove();
            var compiledTemplate = _.template(writeMsgTemplate);
            this.$el.append(compiledTemplate(user));
            return this;
        },
        sendMsg: function(){
            console.log('sendMsg');
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0)
                return;
            this.socket.emit("message_to_server", {message: text, to: this.getUserByIdObj.get("id")});
            setTimeout( function() {
                $('.msg_box').hide();
                $('#wrap').hide();
                alert('Ваше сообщение пользователю ' + that.getUserByIdObj.get("first_name") + ' ' + that.getUserByIdObj.get("last_name") + ' отправлено');
            } , 500)
        },
        sendMsgInDialogue: function(){
            console.log('sendMsgInDialogue');
            if(!this.socket){
                this.object.trigger("getSocket");
            }
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0)
                return;
            if(!this.socket) {
                this.socket_is_ready_obj.once('socket_is_ready', function () {
                    that.socket.emit("message_to_server", {
                        message: text,
                        to: document.URL.split('/')[document.URL.split('/').length - 1]
                    });
                });
            }
            else{
                that.socket.emit("message_to_server", {
                    message: text,
                    to: document.URL.split('/')[document.URL.split('/').length - 1]
                });
            }
            $("#text").val('');
        },
        getOwnerModel: function(){
            var that = this;
            this.ownerModel = new UserModel();
            this.ownerModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            messages: response[0].messages
                        });
                        that.getUserById(document.URL.split('/')[document.URL.split('/').length - 1]);
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            });
        },
        getUserById: function(id){
            var that = this;
            this.getUserByIdObj = new UserModel({id: id});
            this.getUserByIdObj.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends
                        });
                        that.user_obj.trigger('user_is_ready');
                    }
                },
                error: function(model,response){
                    console.log(response);
                }
            });
        },
        writeMsg: function(e){
            this.getUserById(e.target.id.split('msg')[0]);
            if(!this.socket) {
                this.object.trigger("getSocket");
            }
            var that = this;
            this.user_obj.on('user_is_ready', function(){
                that.render({name: that.getUserByIdObj.get("first_name") + " " + that.getUserByIdObj.get("last_name")});
                $('.msg_box').show();
                $('#wrap').show();
            });
        }
    });
    return WriteMsgView;
});