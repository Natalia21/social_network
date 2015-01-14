define([
    'jquery',
    'underscore',
    'backbone'
],function($, _, Backbone){
    var UserModel = Backbone.Model.extend({
       urlRoot: '/user',
       url: '/user',
        "sync": syncMyModel,
        idAttribute : "id",
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
            id: null,
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            friends: []
        }
    });
    function syncMyModel(method, model, options){
        options.url = model.url;
        if(method=='read' && model.get("email") && model.get("password")){
            options.url = model.url + '/' + model.get('email') + '/' + model.get('password');
        }
        if(method=='read' && model.get("id")){
            options.url = model.url + '/' + model.get('id');
        }
        if(method=='create' && !model.get("first_name") && !model.get("last_name") && !model.get("email") && !model.get("password")){
            options.url = '/sign_out';
        }
        return Backbone.sync(method, model, options);
    }
    return UserModel;
});
