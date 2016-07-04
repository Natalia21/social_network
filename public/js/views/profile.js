define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/profile.html',
    '../models/user_model',
    './main'
], function ($, _, Backbone, ProfileTmpl, UserModel, MainView) {
    var ProfileView = App.Views.Main.extend({
        template: _.template(ProfileTmpl),
        el:  $('#content'),

        initialize: function (id) {
            self = this;
            this.user_id = id || App.session.getUser().get('_id');
            this.render();
        },

        renderUser: function (user) {
            $(this.el).html(this.template(user.attributes));
        },

        getUser: function () {
            var model = new UserModel({'_id': this.user_id});
            model.fetch().success(function () {
                self.renderUser(model);
            });
        },

        render: function () {
            var user = App.session.getUser();
            if ( this.user_id == user.get('_id') ) {
                $(this.el).html(this.template(user.attributes));
            } else {
                this.getUser();
            }
            return this;
        }
    });

    return ProfileView;
});
