define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/profile.html',
    '../models/user_model',
    './is_user_view'
], function($, _, Backbone, ProfileTemplate, UserModel, IsUserView){
    var ProfileView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(id){
            $('#content').show();
            var that = this;
            new IsUserView(id, that);
        },
        render: function(){
            var this_user = {user: App.Models.user.attributes};
            //console.log(this_user);
            var compiledTemplate = _.template(ProfileTemplate);
            this.$el.html(compiledTemplate(this_user));
            return this;
        }
    });
    return ProfileView;
});




























