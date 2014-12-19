define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/registering.html',
    '../models/user_model'
], function($, _, Backbone, RegisteringTemplate, UserModel){
    var RegisteringView = Backbone.View.extend({
        el: $('#container'),
        initialize: function(){
            this.render();
            this.form = this.$('form');
            this.first_name = this.form.find('#first_name');
            this.last_name = this.form.find('#last_name');
            this.email = this.form.find('#email');
            this.password = this.form.find('#password');
        },
        events: {
            "click #register": 'submitRegistering'
        },
        submitRegistering: function() {
            var userModel = new UserModel({
                first_name: this.first_name.val(),
                last_name: this.last_name.val(),
                email: this.email.val(),
                password: this.password.val()});
            userModel.save({contentType: "application/json"},{
                success: function(model, response){
                    console.log(response);
                    model._id = response._id;
                    $("#registeringForm").hide();
                    Backbone.history.navigate('profile/' + model._id, true);
                },
                error: function(model,response){
                    console.log(response);
                    alert(response.responseText);
                }
            });
        },

        render: function(){
            $("#loginForm").hide();
            var compiledTemplate = _.template(RegisteringTemplate);
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return RegisteringView;
});