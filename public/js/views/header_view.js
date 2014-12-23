define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html'
], function($, _, Backbone, HeaderTemplate){
    var ProfileView = Backbone.View.extend({
        el:  $('#header'),
        initialize: function(){
            console.log('in header');
            this.render();
        },
        events: {
            "click #search": function(){
                Backbone.history.navigate('search', true);
            }
        },
        render: function(){
            var compiledTemplate = _.template(HeaderTemplate);
            this.$el.append(compiledTemplate);
            return this;
        }
    });
    return ProfileView;
});




























