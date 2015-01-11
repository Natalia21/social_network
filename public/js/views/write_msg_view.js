define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/write_msg.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, io, writeMsgTemplate, UserModel, UsersCollection){
    var WriteMsgView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
            var that = this;
            this.catchEvent();
            this.sign_out_object = {};
            _.extend(this.sign_out_object, Backbone.Events);
            this.sign_out_object.on("sign_out", function(){
                console.log('i am in sign out что в write msg');
                that.catchEvent();
            });
        },
        events: {
            "click .write_msg": 'writeMsg',
            "click .close": function(){
                $('.msg_box').hide();
                $('#wrap').hide();
            },
            "click #submit_msg": 'sendMsg'
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
                that.socket.on('message', function (message) {
                    console.log(message);
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
            var that = this;
            var text = $("#text").val();
            if (text.length <= 0)
                return;
            this.socket.emit("message", {message: text, to: this.getUserById.get("id")});
            setTimeout( function() {
                $('.msg_box').hide();
                $('#wrap').hide();
                alert('Ваше сообщение пользователю ' + that.getUserById.get("first_name") + ' ' + that.getUserById.get("last_name") + ' отправлено');
            } , 500)
        },
        writeMsg: function(e){
            this.object.trigger("getSocket");
            var that = this;
            this.getUserById = new UserModel({id: e.target.id.split('msg')[0]});
            this.getUserById.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends
                        });
                    }
                },
                error: function(model,response){
                    console.log(response);
                }
            }).then(function(){
                that.render({name: that.getUserById.get("first_name") + " " + that.getUserById.get("last_name")});
                $('.msg_box').show();
                $('#wrap').show();
            });
        }
    });
    return WriteMsgView;
});