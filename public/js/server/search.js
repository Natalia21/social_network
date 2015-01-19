var Server = require('../../../server');
var User = Server.User;
var app = Server.app;

app.get("/users/:filtered_data", function(req, res){
    var new_data = [];
    User.find({}, {password: 0, messages: 0}, function(err, data){
        if(err) throw err;
        var filtered_first_name = "^" + req.params.filtered_data.split(" ")[0];
        var reg_first_name = new RegExp(filtered_first_name);
        if(req.params.filtered_data.split(" ")[1]){
            var filtered_last_name = "^" + req.params.filtered_data.split(" ")[1];
            var reg_last_name = new RegExp(filtered_last_name);
            data.forEach(function(index){
                if(index.first_name.toLowerCase() == req.params.filtered_data.split(" ")[0] && reg_last_name.test(index.last_name.toLowerCase())){
                    new_data.push(index);
                }
            })
        }
        else{
            data.forEach(function(index){
                if(reg_first_name.test(index.first_name.toLowerCase())){
                    new_data.push(index);
                }
            })
        }
        res.send(new_data);
    });
});