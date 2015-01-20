var Server = require('../../../server');
var User = Server.User;
var Message = Server.Message;
var app = Server.app;
var client = Server.client;

app.get("/messages/:id1/:id2/:coef", function(req, res){
    var cursor = Message.find({$or:[{from: req.params.id1, to: req.params.id2}, {from: req.params.id2, to: req.params.id1}]}).sort({time: -1}).limit(30).skip(30 * req.params.coef).exec(
        function(err, data){
            if(err) throw err;
            res.send(data);
        }
    )
});

app.get("/messages/:id", function(req, res){
    var for_send = [];
    client.hgetall(req.params.id, function(err, data){
        if(err) throw err;
        if(data) {
            Object.keys(data).forEach(function (key) {
                for_send.push(data[key]);
            });
        }
        res.send(for_send);
    });

});