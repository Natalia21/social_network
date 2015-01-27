var Server = require('../../server');
var User = Server.User;
var app = Server.app;


app.get('/users/:filtered_data', function(req, res){
    var filtered_first_name = '^' + req.params.filtered_data.split(' ')[0];
    var reg_first_name = new RegExp(filtered_first_name);
    if(req.params.filtered_data.split(' ')[1]){
        var filtered_last_name = '^' + req.params.filtered_data.split(' ')[1];
        var reg_last_name = new RegExp(filtered_last_name);
        User.find({first_name: { $regex: reg_first_name, $options: 'i'}, last_name: { $regex: reg_last_name, $options: 'i'}}, {password: 0, messages: 0}, function(err, data){
            if(err) throw err;
                res.send(data);
        });
    }
    else{
        User.find({first_name: { $regex: reg_first_name, $options: 'i'}}, {password: 0, messages: 0}, function(err, data){
            if(err) throw err;
            res.send(data);
        });
    }
});