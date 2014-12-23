define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/profile.html',
    '../models/user_model'
], function($, _, Backbone, ProfileTemplate, UserModel){
    var ProfileView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
            this.render();
        },
        render: function(){
            var this_user = {user: App.Models.user};
            console.log(this_user);
            var compiledTemplate = _.template(ProfileTemplate);
            this.$el.append(compiledTemplate(this_user));
            return this;
        }
    });
    return ProfileView;
});




























