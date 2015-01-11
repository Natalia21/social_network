define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/one_dialogue.html',
    '../models/user_model'
], function($, _, Backbone, DialogueTemplate, UserModel){
    var OneDialogueView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(id){
            this.id = id;
            this.getOwner();
        },
        getUserById: function(){
            var that = this;
            this.getUserByIdObj = new UserModel({id: this.id});
            this.getUserByIdObj.fetch({
                success: function (model, response) {
                    if (response[0]) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends
                        });
                        that.render();
                    }
                },
                error: function (model, response) {
                    console.log(response);
                }
            })
        },
        getOwner: function(){
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
                        that.getUserById();
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            });
        },
        render: function(){
            var that = this;
            var compiledTemplate = _.template('<table  id = "msg_box"></table><hr>');
            this.$el.html(compiledTemplate);
            this.ownerModel.get("messages").forEach(function(index){
                if(index.to == that.id || index.from == that.id){
                    that.$el = $('#msg_box');
                    var compiledTemplate = _.template(DialogueTemplate);
                    var name = '';
                    if(index.from == that.ownerModel.get("id")){
                        name = that.ownerModel.get("first_name") + ' ' + that.ownerModel.get("last_name");
                    }
                    else{
                        name = that.getUserByIdObj.get("first_name") + ' ' + that.getUserByIdObj.get("last_name");
                    }
                    that.$el.append(compiledTemplate({
                        id: index.from,
                        name: name,
                        msg: index.text,
                        time: index.time
                    }));
                }
            });
            return this;
        }
    });
    return OneDialogueView;
});















