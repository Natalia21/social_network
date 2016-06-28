define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/navbar.html',
    './main'
], function ($, _, Backbone, PageTmpl, MainView) {
    var NavbarView = App.Views.Main.extend({
        template: _.template(PageTmpl),
        el: $('#navbar'),

        initialize: function () {
            this.user_id = App.session.getUser().get('_id');
            this.render();
        },

        render: function () {
            $(this.el).html(this.template({'id': this.user_id}));
            $('.main').show();
            return this;
        }
    });

    return NavbarView;
});
