define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html',
    'models/user_model'
], function($, _, Backbone, HeaderTemplate, UserModel){
    var HeaderView = Backbone.View.extend({
        el:  $('#header'),
        initialize: function(){
            $('#header').show();
            this.render();
        },
        events: {
            "click #search": function(){
                Backbone.history.navigate('search', true);
            },
            "click #signOut": function(){
                $('#header').hide();
                $('#navbar').hide();
                $('#content').hide();
                $('#row').removeClass('full');
                var sign_out_model = new UserModel;
                sign_out_model.save({}).then(function(){
                    Backbone.history.navigate('login', true);
                });
            }
        },
        render: function(){
            var compiledTemplate = _.template(HeaderTemplate);
            this.$el.html(compiledTemplate);
            return this;
        }
    });
    return HeaderView;
});




























