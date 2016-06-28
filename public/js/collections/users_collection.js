define([
    'jquery',
    'underscore',
    'backbone',
    '../models/user_model'
],function ($, _, Backbone, UserModel) {
    var UsersCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users',
        search: filter
    });

    function filter (letters) {
        if (letters === '') {
            return this;
        }
        return _(
            this.filter(function(data) {
                var name = data.get('first_name').toLowerCase() + ' ' + data.get('last_name').toLowerCase();
                return name.indexOf(letters) !== -1;
            })
        );        
    }

    return UsersCollection;
});
