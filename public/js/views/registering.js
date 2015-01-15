define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/registering.html',
    '../models/user_model',
    './requests_user'
], function($, _, Backbone, io, RegisteringTemplate, UserModel, DoSmthWithUserView){
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
            this.user_action = new DoSmthWithUserView();
            this.user_action.newUser({
                first_name: this.first_name.val(),
                last_name: this.last_name.val(),
                email: this.email.val(),
                password: this.password.val()
            });
            this.user_action.object.once('user_is_new', function(user){
                $("#registeringForm").remove();
                Backbone.history.navigate('profile/' + user.get("id"), true);
            });
        },

        render: function(){
            var compiledTemplate = _.template(RegisteringTemplate);
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return RegisteringView;
});