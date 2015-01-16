define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var FriendModel = Backbone.Model.extend({
        urlRoot: '/friends',
        url: '/friends',

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
            from: "",
            to: "",
            confirm: ""
        }
    });

    return FriendModel;
});
