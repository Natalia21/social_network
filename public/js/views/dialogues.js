define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/dialogue.html',
    './requests_user',
    './requests_owner',
    './requests_msgs'
], function($, _, Backbone, DialogueTemplate, RequestsUser, RequestsOwner, RequestsMsgs){
    var DialoguesView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
        },
        init: function(){
            this.$el = $('#content');
            var that = this;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner) {
                that.msg_action = new RequestsMsgs();
                that.msg_action.getMsgs();
                that.msg_action.object.once('msgs_is_fetched', function(msgs) {
                    that.render(owner, msgs);
                });
                that.msg_action.object.once('msgs_is_absent', function() {
                    that.msgsAreAbsent();
                });
            });
        },
        msgsAreAbsent: function(){
            var compiledTemplate = _.template('<h2>У вас пока нет сообщений</h2>');
            this.$el.html(compiledTemplate);
        },
        render: function(owner, msgs){
            var that = this;
            var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_msgs"></ul>');
            this.$el.html(compiledTemplate);
            var dialoguesHasBeenInList = [];
            msgs.models.forEach(function(index){
                var foreign_id = null;
                if(index.get("to") != owner.get("id")){
                    foreign_id = index.get("to");
                }
                else{
                    foreign_id = index.get("from");
                }
                dialoguesHasBeenInList.push(foreign_id);
                that.user_action = new RequestsUser();
                that.user_action.getUser(foreign_id);
                that.user_action.object.once('user_is_fetched', function(user){
                    that.$el = $('#my_msgs');
                    var compiledTemplate = _.template(DialogueTemplate);
                    that.$el.append(compiledTemplate({
                        id: user.get("id"),
                        name: user.get("first_name") + ' ' + user.get("last_name"),
                        msg: index.get("text"),
                        time: index.get("time")
                    }));
                });
            });
            return this;
        }
    });
    return DialoguesView;
});