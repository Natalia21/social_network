var Server = require('../../server');
var User = Server.User;
var app = Server.app;

app.put('/add_friend', function(req, res, next) {
    User.update({_id: req.body.id}, {$push: {friends: req.body.friends}}, function(err, data){
        if(err) throw err;
        User.find({_id: req.body.id}, {password: 0, messages: 0}, function(err, data){
            if(err) throw err;
            res.send(data);
        });
    });
});
app.put('/confirm_friend', function(req, res, next) {
    User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
        if(err) throw err;
        User.update({_id: req.body.id}, {$push: {friends: req.body.friends}}, function(err, data){
            if(err) throw err;
            User.find({_id: req.body.id}, {password: 0, messages: 0}, function(err, data){
                if(err) throw err;
                res.send(data);
            });
        });
    });
});

app.put('/kill_friend', function(req, res) {
    User.update({_id: req.body.id}, {$pull: {friends: {id: req.body.friends.id}}}, function(err, data){
        if(err) throw err;
        User.update({_id: req.body.friends.id}, {$pull: {friends: {id: req.body.id}}}, function(err, data){
            if(err) throw err;
            User.find({_id: req.body.friends.id}, {password: 0, messages: 0}, function(err, data){
                if(err) throw err;
                res.send({text: 'Пользователь ' + data[0].first_name + ' ' + data[0].last_name + ' удалён'});
            });
        });
    });
});

