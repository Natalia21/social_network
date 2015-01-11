define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/dialogue.html',
    '../models/user_model'
], function($, _, Backbone, DialogueTemplate, UserModel){
    var DialoguesView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
            this.getOwner();
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
                        that.render();
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
            if(this.ownerModel.get("messages").length == 0){
                var compiledTemplate = _.template('<h2>У вас пока нет сообщений</h2>');
                this.$el.html(compiledTemplate);
            }
            else{
                var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_msgs"></ul>');
                this.$el.html(compiledTemplate);
                var dialoguesHasBeenInList = [];
                this.ownerModel.get("messages").reverse().forEach(function(index){
                    var foreign_id = null;
                    if(index.to != that.ownerModel.get("id")){
                        foreign_id = index.to;
                    }
                    else{
                        foreign_id = index.from;
                    }
                    if(dialoguesHasBeenInList.indexOf(foreign_id) == -1) {
                        dialoguesHasBeenInList.push(foreign_id);
                        var getUserById = new UserModel({id: foreign_id});
                        getUserById.fetch({
                            success: function (model, response) {
                                if (response[0]) {
                                    model.set({
                                        id: response[0]._id,
                                        email: response[0].email,
                                        first_name: response[0].first_name,
                                        last_name: response[0].last_name,
                                        friends: response[0].friends
                                    });
                                }
                            },
                            error: function (model, response) {
                                console.log(response);
                            }
                        }).then(function () {
                            that.$el = $('#my_msgs');
                            var compiledTemplate = _.template(DialogueTemplate);
                            that.$el.append(compiledTemplate({
                                id: getUserById.get("id"),
                                name: getUserById.get("first_name") + ' ' + getUserById.get("last_name"),
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















