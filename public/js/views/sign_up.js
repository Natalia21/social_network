define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/registering.html',
    '../models/current_user_model',
    './main'
], function ($, _, Backbone, io, SignUpTmpl, CurrentUserModel, MainView) {
    var SignUpView = App.Views.Main.extend({
        template: _.template(SignUpTmpl),
        el: $('.login_container'),

        events: {
            "click #register": 'submitSignUp'
        },

        initialize: function () {
            this.render();
        },

        submitSignUp: function () {
            var form = $('form');
            var first_name = form.find('#first_name').val();
            var last_name = form.find('#last_name').val();
            var email = form.find('#email').val();
            var password = form.find('#password').val();

            var userModel = new CurrentUserModel({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password
            });
            userModel.save({}, {
                success: function (model, response) {
                    App.session
                                .setAuthenticated(true)
                                .setUser(model);
                    Cookies.set('user', model);
                    App.addUser();
                    var user_id = userModel.get('_id');
                    Backbone.history.navigate('profile/' + user_id, true);
                },
                error: function (model, response, status) {
                    if (response.status === 500) {
                        alert(response.responseJSON.msg);
                    } else {
                        alert('Something went wrong...');
                    }
                }
            });
        },

        render: function () {
            $(this.el).html(this.template());
            $('.main').hide();
            return this;
        }
    });

    return SignUpView;
});