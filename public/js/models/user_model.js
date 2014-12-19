define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var UserModel = Backbone.Model.extend({
        urlRoot: '/user',
        url: '/user',
        "sync": syncMyModel,
        idAttribute : "_id",
        validate: function( attributes ){
            if(!attributes.first_name || !attributes.last_name || !attributes.email || !attributes.password){
                alert("Please, fill all fields!");
                return "Please, fill all fields!";
            }
            if(attributes.password.length < 6){
                alert("Your password must have more then 5 symbols");
                return "Your password must have more then 5 symbols";
            }
        },
        defaults : {
            _id: null,
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    });
    function syncMyModel(method, model, options){
        if(method=='read'){
            options.url = model.url + '/' + model.get('email') + '/' + model.get('password');
        }else{
            options.url = model.url;
        }
        return Backbone.sync(method, model, options);
    }
    return UserModel;
});
