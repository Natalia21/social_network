define([
    'jquery',
    'underscore',
    'backbone',
    '../views/validation'
],function($, _, Backbone, ValidationView){
    var UserModel = Backbone.Model.extend({
       urlRoot: '/user',
       url: '/user',
        "sync": syncMyModel,
        idAttribute : "id",
        validate: function( attributes ){
            if(this.isNew()){
                var errors = [];
                if(!attributes.first_name){
                    errors.push({attr: 'first_name', msg: "Please, fill this fields!"});
                }
                if(!attributes.last_name){
                    errors.push({attr: 'last_name', msg: "Please, fill this fields!"});
                }
                if(!attributes.email){
                    errors.push({attr: 'email', msg: "Please, fill this fields!"});
                }
                if(attributes.password.length < 6){
                    errors.push({attr: 'password', msg: "Your password must have more then 5 symbols"});
                }
                if(!_.isEmpty(errors)){
                    return errors;
                }
            }
        },
        defaults : {
            id: null,
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            friends: [],
            messages: []
        },
        initialize: function(){
           var valid = new ValidationView();
           this.on("invalid", function(model, error){
                valid.handleError(model, error)
           });
        },
        sign_out: function () {
            return $.ajax({
                url: "sign_out",
                method: "POST"
            });
        }
    });

    function syncMyModel(method, model, options){
        options.url = model.url;
        if(method=='read'){
            options.url = '/owner'
        }
        if(method=='read' && this.coef != undefined){
            options.url = '/get_msgs/' + this.coef;
        }
        if(method=='read' && model.get("email") && model.get("password")){
            options.url = model.url + '/' + model.get('email') + '/' + model.get('password');
        }
        if(method=='read' && model.get("id")){
            options.url = model.url + '/' + model.get('id');
        }
        return Backbone.sync(method, model, options);
    }

    return UserModel;
});
