define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection){
    var ConfirmRequestView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
        },
        events:{
            'click .addFriend': 'addFriend'
        },
        addFriend: function(e){
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function (model, response) {
                    if (response[0]) {
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name
                        });
                        this.id = model.get("id");
                    }
                },
                error: function (model, response) {
                    console.log(response);
                }
            }).then(function () {
                ownerModel.save({friends: {id: e.target.id.split('friend')[0], confirm: true, _new: false}},{
                    success: function(){
                        var addedUser = new UserModel({id: e.target.id.split('friend')[0]});
                        addedUser.save({friends: {id: this.id, confirm: true, _new: false}});
                        $("#" + e.target.id.split('friend')[0]).remove();
                        if($("#my_friends_list")[0].children.length == 0){
                             var compiledTemplate = _.template('<h2>У вас нет новых заявок</h2>');
                             this.$el = $("#content");
                             this.$el.html(compiledTemplate);
                         }
                    }

            });

        })
    }
    });
    return ConfirmRequestView;
});