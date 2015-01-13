define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header_friends.html',
    '../models/user_model'
], function($, _, Backbone, HeaderTemplate, UserModel){
    var HeaderFriendsView = Backbone.View.extend({
        id: '',
        el:  $('#header'),
        initialize: function(id){
            $('#header').show();
            this.id = id;
            this.render();
        },
        render: function(){
            var compiledTemplate = _.template(HeaderTemplate);
            this.$el.html(compiledTemplate({id: this.id}));
            $('.add_style').css('margin-left', $('#navbar').css('width'));
            return this;
        }
    });
    return HeaderFriendsView;
});




























