define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/navbar.html',
    './profile',
    '../models/user_model',
    './requests_owner'
], function($, _, Backbone, pageTemplate, ProfileView, UserModel, DoSmthWithOwnerView){

    var NavbarView = Backbone.View.extend({
        el: $('#navbar'),
        id: '',
        initialize: function(){
        },
        init: function(){
            $('#navbar').show();
            var that = this;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.render(owner);
            });
        },
        render: function(owner){
            var compiledTemplate = _.template(pageTemplate);
            this.$el.html(compiledTemplate({id: owner.get("id")}));
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
        }
    });
    return NavbarView;
});
















