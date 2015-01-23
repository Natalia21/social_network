define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header_friends.html'
], function($, _, Backbone, HeaderTemplate){
    var HeaderFriendsView = Backbone.View.extend({
        id: '',
        el:  $('#header'),
        initialize: function(){
        },
        init: function(id){
            $('#header').show();
            this.id = id;
            this.render();
        },
        render: function(){
            var compiledTemplate = _.template(HeaderTemplate);
            this.$el.html(compiledTemplate({id: this.id}));
            $('.friends_action').css('margin-left', $('#navbar').css('width'));
            return this;
        }
    });
    return HeaderFriendsView;
});



























