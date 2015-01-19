var Server = require('../../../server');
var User = Server.User;
var Message = Server.Message;
var app = Server.app;
var client = Server.client;

app.get("/messages/:id1/:id2/:coef", function(req, res){
    console.log(-30 * req.params.coef);
    Message.find({$or:[{from: req.params.id1, to: req.params.id2}, {from: req.params.id2, to: req.params.id1}]}, {sort: {time: -1}, limit: 30, skip: 30 * req.params.coef}, function(err, data){
        if(err) throw err;
        res.send(data);
    });
});

app.get("/messages/:id", function(req, res){
    var first = client.hgetall(req.params.id, function(err, data){
        if(err) throw err;
        console.log(data);
        res.send(data);
    });
   // var second =  client.hget("messages", req.params.id2 + ':' + req.params.id1);
   // console.log(second);

    /*Message.find({$or:[{from: req.params.id1, to: req.params.id2}, {from: req.params.id2, to: req.params.id1}]}, {sort: {time: -1}, limit: 30, skip: 30 * req.params.coef}, function(err, data){
        if(err) throw err;
        res.send(data);
    });*/
});