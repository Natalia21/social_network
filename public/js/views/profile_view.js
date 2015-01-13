define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/profile.html',
    './do_smth_with_user_view'
], function($, _, Backbone, ProfileTemplate, DoSmthWithUserView){
    var ProfileView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(id){
            var that = this;
            $('#content').show();
            this.user_action = new DoSmthWithUserView();
            this.user_action.getUser(id);
            this.user_action.object.once('user_is_fetched', function(user){
                that.render(user);
            });
        },
        render: function(user){
            var compiledTemplate = _.template(ProfileTemplate);
            this.$el.html(compiledTemplate(user.attributes));
            return this;
        }
    });
    return ProfileView;
});




























