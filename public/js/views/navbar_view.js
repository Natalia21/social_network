define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/navbar.html',
    './profile_view',
    '../models/user_model'
], function($, _, Backbone, pageTemplate, ProfileView, UserModel){

    var NavbarView = Backbone.View.extend({
        el: $('#navbar'),
        id: '',
        initialize: function(id){
            console.log(Backbone);
            this.id = id;
            this.render();
            new ProfileView();
        },
        events: {
            "click #profile": function(){
            },
            "click #friends": function(){},
            "click #msg": function(){}
        },
        render: function(){
            $("#loginForm").hide();
            $("#registeringForm").hide();
            var compiledTemplate = _.template(pageTemplate);
            this.$el.append(compiledTemplate({id: this.id}));
            this.addClasses();
            return this;
        },
        addClasses: function(){
            $('#navbar').addClass('navbar_color');
            $('#content').addClass('content_color');
            $('#row').addClass('full');
            $('#navbar').addClass('full');
            $('#content').addClass('full');
            $('#header').addClass('header_style');
            $('#row').addClass('row_style');
        }
    });
    return NavbarView;
});