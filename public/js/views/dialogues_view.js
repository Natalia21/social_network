define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/dialogue.html',
    '../models/user_model',
    './do_smth_with_user_view',
    './do_smth_with_owner_view'
], function($, _, Backbone, DialogueTemplate, UserModel, DoSmthWithUserView, DoSmthWithOwnerView){
    var DialoguesView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner) {
                that.render(owner);
            });
        },
        render: function(owner){
            var that = this;
            if(owner.get("messages").length == 0){
                var compiledTemplate = _.template('<h2>У вас пока нет сообщений</h2>');
                this.$el.html(compiledTemplate);
            }
            else{
                var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_msgs"></ul>');
                this.$el.html(compiledTemplate);
                var dialoguesHasBeenInList = [];
                owner.get("messages").reverse().forEach(function(index){
                    var foreign_id = null;
                    if(index.to != owner.get("id")){
                        foreign_id = index.to;
                    }
                    else{
                        foreign_id = index.from;
                    }
                    if(dialoguesHasBeenInList.indexOf(foreign_id) == -1) {
                        dialoguesHasBeenInList.push(foreign_id);
                        that.user_action = new DoSmthWithUserView();
                        that.user_action.getUser(foreign_id);
                        that.user_action.object.once('user_is_fetched', function(user){
                            that.$el = $('#my_msgs');
                            var compiledTemplate = _.template(DialogueTemplate);
                            that.$el.append(compiledTemplate({
                                id: user.get("id"),
                                name: user.get("first_name") + ' ' + user.get("last_name"),
                                msg: index.text,
                                time: index.time
                            }));
                        });
                    }
                });
            }
            return this;
        }
    });
    return DialoguesView;
});















