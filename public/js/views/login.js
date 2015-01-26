define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/login.html',
    './requests_user'
], function($, _, Backbone, loginTemplate, RequestsUser){

    var LoginView = Backbone.View.extend({
        el: $('#container'),
        initialize: function(socket_is_ready_obj){
            this.socket_is_ready_obj = socket_is_ready_obj;
            this.object = {};
            _.extend(this.object, Backbone.Events);
        },
        events: {
            "click #signIn": 'submitSignIn',
            "click #register_in_login": 'submitRegistering'
        },
        init: function(){
            this.render();
            this.form = this.$('form');
            this.email = this.form.find('#email');
            this.password = this.form.find('#password');
        },
        submitSignIn: function() {
            var that = this;
            this.user_action = new RequestsUser();
            this.user_action.loginUser(this.email.val(), this.password.val());
            this.user_action.object.once('user_is_logined', function(model) {
                if(model.text){
                    alert('Email or password is incorrect!');
                }
                else{
                    that.socket_is_ready_obj.trigger('get_socket', model);
                }
            });
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