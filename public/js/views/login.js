define([
    'jquery',
    'underscore',
    'backbone',
    'jscookie',
    'text!/templates/login.html',
    '../models/current_user_model',
    './main'
], function ($, _, Backbone, Jscookie, LoginTmpl, CurrentUserModel, MainView) {
    var LoginView = App.Views.Main.extend({
        template: _.template(LoginTmpl),
        el: $('#content'),

        events: {
            'click #log_in': 'submitLogIn',
            'click #register_in_login': 'goToSignUp'
        },

        initialize: function () {
            this.render();
        },

        submitLogIn: function (e) {
            e.preventDefault();
            var form = $('form');
            var email = form.find('#email').val();
            var password = form.find('#password').val();

            $.ajax({
                method: 'POST',
                url: '/login',
                data: {
                    email: email,
                    password: password
                },
                success: function (model) {
                    var userModel = new CurrentUserModel(model);
                    App.session
                                .setAuthenticated(true)
                                .setUser(userModel);
                    Cookies.set('user', userModel);
                    App.addUser();
                    var user_id = userModel.get('_id');
                    Backbone.history.navigate('profile/' + user_id, true);
                },
                error: function (model, res) {
                    if (res.status == 500) {
                        alert(res.responseJSON.msg);
                    } else {
                        alert('Something went wrong...');
                    }
                    form.find('input').val('');
                }
            });
        },

        goToSignUp: function () {
            Backbone.history.navigate('signUp', true);
        },

        render: function () {
            $(this.el).html(this.template);
            return this;
        }
    });

    return LoginView;
});