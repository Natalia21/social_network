var Server = require('../../../server');
var Friends = Server.Friends;
var app = Server.app;


app.get("/friends/:confirm/:from/:to", function(req, res){
    console.log('friends ');
    console.log(req.params);
    if(req.params.confirm == 'true'){
        console.log(1);
        Friends.find({$or: [{confirm: req.params.confirm, from: req.params.from}, {confirm: req.params.confirm, to: req.params.to}]}, function(err, data){
            if(err) throw err;
            console.log(data);
            res.send(data);
        });
    }
    else{
        if(req.params.from == req.params.to){
            Friends.find({$or: [{from: req.params.from}, {to: req.params.to}]}, function(err, data){
                if(err) throw err;
                console.log(data);
                res.send(data);
            });
        }
        else{
            if(req.params.from){
                console.log(2);
                Friends.find({confirm: req.params.confirm, from: req.params.from}, function(err, data){
                    if(err) throw err;
                    console.log(data);
                    res.send(data);
                });
            }
            else{
                console.log(3);
                Friends.find({confirm: req.params.confirm, to: req.params.to}, function(err, data){
                    if(err) throw err;
                    console.log(data);
                    res.send(data);
                });
            }
        }

    }

});