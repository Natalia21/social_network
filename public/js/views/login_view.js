define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/login.html',
    '../models/user_model'
], function($, _, Backbone, loginTemplate, UserModel){
    var LoginView = Backbone.View.extend({
        el: $('#container'),
        initialize: function(){
            this.render();
            this.form = this.$('form');
            this.email = this.form.find('#email');
            this.password = this.form.find('#password');
        },
        events: {
            "click #signIn": 'submitSignIn',
            "click #register": 'submitRegistering'
        },
        submitSignIn: function() {
            var userModel = new UserModel({
                email: this.email.val(),
                password: this.password.val()});
            userModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model._id = response[0]._id;
                        model.email = response[0].email;
                        model.password = response[0].password;
                        model.first_name = response[0].first_name;
                        model.last_name = response[0].last_name;
                        $("#loginForm").hide();
                        Backbone.history.navigate('profile/' + model._id, true);
                    }
                    else{
                        alert('Email or password is incorrect!');
                    }
                },
                error: function(model,response){
                    console.log(response);
                }
            });
        },
        submitRegistering: function(){
            Backbone.history.navigate('registering', true);
        },
        render: function(){
            var compiledTemplate = _.template(loginTemplate);
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return LoginView;
});