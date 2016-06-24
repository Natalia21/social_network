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
        el: $('.login_container'),

        events: {
            'click #signIn': 'submitSignIn',
            'click #register_in_login': 'goToSignUp'
        },

        initialize: function () {
            this.render();
        },

        submitSignIn: function (e) {
            e.preventDefault();
            var form = $('form');
            var email = form.find('#email').val();
            var password = form.find('#password').val();

            $.ajax({
                method: 'GET',
                url: '/login/' + email + '/' + password,
                success: function (model, response) {
                    var userModel = new CurrentUserModel(model);
                    App.session
                                .setAuthenticated(true)
                                .setUser(userModel);
                    Cookies.set('user', userModel);
                    App.addUser();
                    var user_id = userModel.get('_id');
                    Backbone.history.navigate('profile/' + user_id, true);
                },
                error: function (model, response) {
                    if (response.status == 500) {
                        alert(response.responseJSON.msg);
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
            $('.main').hide();
            return this;
        }
    });

    return LoginView;
});