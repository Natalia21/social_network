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
            var compiledTemplate = _.template('<div  id = "msg_box"><div id = "div_for_name_and_msg"><ul id = "for_name_and_msg"></ul></div><div id = "div_for_data"><ul id = "for_data"></ul></div></div>');
            this.$el.html(compiledTemplate);
            this.ownerModel.get("messages").forEach(function(index){
                if(index.to == that.id || index.from == that.id){
                    that.$el = $('#for_name_and_msg');
                    var current_height = $('#for_name_and_msg').css('height');
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
                        msg: index.text
                    }));
                    that.$el = $('#for_data');
                    var compiledTemplate = _.template('<li class = "data_time"><%= time %></li>');
                    that.$el.append(compiledTemplate({
                        time: index.time
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
                }
            });
            this.$el = $('#content');
            var compiledTemplate = _.template('<div id = "div_with_textarea"><center><textarea id = "text"></textarea><button type="submit" class="btn btn-primary" id = "submit_msg_in_dialogue">  Отправить  </button></center></div>');
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return OneDialogueView;
});















