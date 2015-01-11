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
        initialize: function(){
            $('#navbar').show();
            var that = this;
            this.getOwner(that);
        },
        events: {
            "click #profile": function(){
            },
            "click #friends": function(){},
            "click #msg": function(){}
        },
        getOwner: function(that){
            var ownerModel = new UserModel();
            ownerModel.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name
                        });
                        that.id = model.get("id");
                        that.render();
                    }
                },
                error: function(model,response){
                    console.log('in error');
                    console.log(response);
                }
            });
        },
        render: function(){
            var compiledTemplate = _.template(pageTemplate);
            this.$el.html(compiledTemplate({id: this.id}));
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
















