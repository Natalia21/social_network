define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/one_dialogue.html',
    '../models/user_model',
    './requests_user',
    './requests_owner',
    './requests_msgs'
], function($, _, Backbone, DialogueTemplate, UserModel, DoSmthWithUserView, DoSmthWithOwnerView, RequestsMsgs){
    var OneDialogueView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(socket_is_ready_obj){
            this.socket_is_ready_obj = socket_is_ready_obj;
            this.catchEvent();
        },
        init: function(id){
            this.coef = 0;
            this.$el = $('#content');
            this.id = id;
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.user_action = new DoSmthWithUserView();
                that.user_action.getUser(id);
                that.user_action.object.once('user_is_fetched', function (user) {
                    that.msg_action = new RequestsMsgs();
                    that.msg_action.getMsgs(owner.get("id"), user.get("id"), that.coef);
                    that.msg_action.object.once('msgs_is_fetched', function(msgs) {
                        that.user = user;
                        that.render(owner, user, msgs);
                    });
                });
            });
        },
        catchEvent: function(){
            var that = this;
            this.socket_is_ready_obj.on('socket_is_ready', function(socket, owner){
                that.socket = socket;
                socket.on('message_to_me', function (message) {
                    that.buildView(owner, message);
                });
                socket.on('message_to_user', function (message) {
                    that.buildView(owner, message);
                });
            });
        },
        buildView: function(owner, message){
            this.$el = $('#for_name_and_msg');
            var current_height = $('#for_name_and_msg').css('height');
            var compiledTemplate = _.template(DialogueTemplate);
            var name = '';
            this.user_action = new DoSmthWithUserView();
            if (message.from == owner.get("id")) {
                name = owner.get("first_name") + ' ' + owner.get("last_name");
            }
            if (message.from == this.user.get("id")) {
                name = this.user.get("first_name") + ' ' + this.user.get("last_name");
            }
            if(name){
                this.$el = $('#for_name_and_msg');
                this.$el.append(compiledTemplate({id: message.from, name: name, msg: message.text}));
                this.$el = $('#for_data');
                var compiledTemplate2 = _.template('<li class = "data_time"><%= time %></li>');
                this.$el.append(compiledTemplate2({
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
        },
        updateMsgHistory: function(owner, user){
            var that = this;
            $('#msg_box').on('scroll', function(){
                if($('#msg_box').scrollTop() == 0){
                    that.coef++;
                    that.msg_action.getMsgs(owner.get("id"), user.get("id"), that.coef);
                    that.msg_action.object.once('msgs_is_fetched', function(msgs){
                        that.pushMoreMsgs(owner, user, msgs);
                    });
                }
            })
        },
        pushMoreMsgs: function(owner, user, msgs){
            var that = this;
            var current_height;
            msgs.models.forEach(function(index){
                that.$el = $('#for_name_and_msg');
                current_height = $('#for_name_and_msg').css('height').split('px')[0];
                var compiledTemplate = _.template(DialogueTemplate);
                var name = '';
                if(index.get("from") == owner.get("id")){
                    name = owner.get("first_name") + ' ' + owner.get("last_name");
                }
                else{
                    name = user.get("first_name") + ' ' + user.get("last_name");
                }
                that.$el.prepend(compiledTemplate({
                    id: index.get("from"),
                    name: name,
                    msg: index.get("text")
                }));
                that.$el = $('#for_data');
                var compiledTemplate = _.template('<li class = "data_time"><%= time %></li>');
                that.$el.prepend(compiledTemplate({
                    time: index.get("time")
                }));
                var new_height = 450 - current_height;
                $('#div_for_name_and_msg').css('padding-top', new_height + 'px');
                $('#div_for_data').css('padding-top', new_height + 'px');
                var children_name_and_msg = $('#for_name_and_msg').children();
                var children_date = $('#for_data').children();
                for(var i = 1; i < children_date.length; i++){
                    children_date[i].setAttribute('style', 'padding-top: ' + children_name_and_msg[i * 2 - 1].offsetHeight + 'px');
                }
            });
            $('#msg_box').animate({"scrollTop": current_height - that.initial_height.split('px')[0] + 'px'}, 1);
            this.initial_height = current_height;
        },
        pushLastMsgs: function(owner, user, msgs){
            var that = this;
            msgs.models.reverse().forEach(function(index){
                that.$el = $('#for_name_and_msg');
                var current_height = $('#for_name_and_msg').css('height');
                var compiledTemplate = _.template(DialogueTemplate);
                var name = '';
                if(index.get("from") == owner.get("id")){
                    name = owner.get("first_name") + ' ' + owner.get("last_name");
                }
                else{
                    name = user.get("first_name") + ' ' + user.get("last_name");
                }
                that.$el.append(compiledTemplate({
                    id: index.get("from"),
                    name: name,
                    msg: index.get("text")
                }));
                that.$el = $('#for_data');
                var compiledTemplate = _.template('<li class = "data_time"><%= time %></li>');
                that.$el.append(compiledTemplate({
                    time: index.get("time")
                }));
                var new_height = 450 - current_height.split('px')[0];
                $('#div_for_name_and_msg').css('padding-top', new_height + 'px');
                $('#div_for_data').css('padding-top', new_height + 'px');
                var children_name_and_msg = $('#for_name_and_msg').children();
                var children_date = $('#for_data').children();
                for(var i = 1; i < children_date.length; i++){
                    children_date[i].setAttribute('style', 'padding-top: ' + children_name_and_msg[i * 2 - 1].offsetHeight + 'px');
                }
                $('#msg_box').animate({"scrollTop":$('#for_name_and_msg').css("height")}, 1);
            });
            this.initial_height = $('#for_name_and_msg').css("height");
        },
        render: function(owner, user, msgs){
            var compiledTemplate = _.template('<div  id = "msg_box"><div id = "div_for_name_and_msg"><ul id = "for_name_and_msg"></ul></div><div id = "div_for_data"><ul id = "for_data"></ul></div></div>');
            this.$el.html(compiledTemplate);
            this.pushLastMsgs(owner, user, msgs);
            this.$el = $('#content');
            var compiledTemplate = _.template('<div id = "div_with_textarea"><center><textarea id = "text"></textarea><button type="submit" class="btn btn-primary" id = "submit_msg_in_dialogue">  Отправить  </button></center></div>');
            this.$el.append(compiledTemplate);
            this.updateMsgHistory(owner, user);
            return this;
        }
    });
    return OneDialogueView;
});