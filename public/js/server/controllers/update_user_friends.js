var Server = require('../../../../server');
var User = Server.User;
var app = Server.app;


app.put("/user", function(req, res, next) {
    if(req.body.friends.confirm == true){//confirm friend
        User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
            if(err) throw err;
        });
    }
    if(req.body.friends.confirm == undefined && req.body.friends._new == undefined){//kill friend
        next();
    }
    else{//add friend
        User.update({_id: req.body.id}, {$push: {friends: req.body.friends}}, function(err, data){
            if(err) throw err;
        });
        User.find({_id: req.body.id}, {password: 0, messages: 0}, function(err, data){
            if(err) throw err;
            res.send(data);
        });
    }
});
app.put("/user", function(req, res) {
    User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
        if(err) throw err;
    });
    User.update({_id: req.body.friends.id}, {$pull: {friends: {id: req.body.id}}}, function(err, data){
        if(err) throw err;
    });
    User.find({_id: req.body.friends.id}, {password: 0, messages: 0}, function(err, data){
        if(err) throw err;
        res.send({text: "Пользователь " + data[0].first_name + " " + data[0].last_name + " удалён"});
    });
});
