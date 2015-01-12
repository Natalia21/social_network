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
            "click #register_in_login": 'submitRegistering'
        },
        submitSignIn: function() {
            if(this.email.val() != '') {
                var userModel = new UserModel({
                    email: this.email.val(),
                    password: this.password.val()
                });
                userModel.fetch({
                    success: function (model, response) {
                        if (response[0]) {
                            model.set({
                                id: response[0]._id,
                                email: response[0].email,
                                password: '',
                                first_name: response[0].first_name,
                                last_name: response[0].last_name
                            });
                            $("#loginForm").remove();
                            Backbone.history.navigate('profile/' + model.get("id"), true);
                        }
                        else {
                            alert('Email or password is incorrect!');
                        }
                    },
                    error: function (model, response) {
                        console.log(response);
                    }
                })
            }
            this.email.val('');
            this.password.val('');
        },
        submitRegistering: function(){
            $("#loginForm").remove();
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