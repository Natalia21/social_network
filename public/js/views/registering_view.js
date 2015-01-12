define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/registering.html',
    '../models/user_model'
], function($, _, Backbone, io, RegisteringTemplate, UserModel){
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
            if(this.email.val() != '') {
                var userModel = new UserModel({
                    first_name: this.first_name.val(),
                    last_name: this.last_name.val(),
                    email: this.email.val(),
                    password: this.password.val()
                });
                userModel.save({contentType: "application/json"}, {
                    success: function (model, response) {
                        model.set({id: response[0]._id, password: ''});
                        $("#registeringForm").remove();
                        Backbone.history.navigate('profile/' + model.get("id"), true);
                    },
                    error: function (model, response) {
                        console.log(response);
                        alert(response.responseText);
                    }
                });
            }
            this.email.val('');
        },

        render: function(){
            var compiledTemplate = _.template(RegisteringTemplate);
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return RegisteringView;
});