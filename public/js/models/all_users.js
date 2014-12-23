define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var AllUsersModel = Backbone.Model.extend({
        urlRoot: '/users',
        url: '/users',
/*        validate: function( attributes ){
            if(!attributes.first_name || !attributes.last_name || !attributes.email || !attributes.password){
                alert("Please, fill all fields!");
                return "Please, fill all fields!";
            }
            if(attributes.password.length < 6){
                alert("Your password must have more then 5 symbols");
                return "Your password must have more then 5 symbols";
            }
        },*/
        defaults : {
            first_name: "",
            last_name: ""
        }
    });

    return AllUsersModel;
});
