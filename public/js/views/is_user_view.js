define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
], function($, _, Backbone, UserModel){
    var IsUserView = Backbone.View.extend({
        initialize: function(id, that){
            this.render(id, that);
        },
        render: function(id, that){
            var userModel = new UserModel({
                id: id
            });
            userModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            password: response[0].password,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                        });
                        App.Models.user = model;
                    }
                    that.render();
                },
                error: function(model,response){
                    console.log(response);
                }
            })
        }
    });
    return IsUserView;
});




























