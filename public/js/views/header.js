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
        },
        init: function(){
            $('#header').show();
            this.render();
        },
        render: function(){
            var compiledTemplate = _.template(HeaderTemplate);
            this.$el.html(compiledTemplate);
            return this;
        }
    });
    return HeaderView;
});



























