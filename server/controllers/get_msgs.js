var Server = require('../../server');
var User = Server.User;
var Message = Server.Message;
var app = Server.app;
var client = Server.client;

app.get('/messages/:id/:coef', function(req, res){
    var obj1 = {from: req.params.id, to: req.user._id};
    var obj2 = {from: req.user._id, to: req.params.id};
    Message.find({$or:[obj1, obj2]}).sort({time: -1}).limit(30).skip(30 * req.params.coef).exec(
        function(err, data){
            if(err) throw err;
            res.send(data);
        }
    )
});

app.get('/messages', function(req, res){
    var for_send = [];
    client.hgetall(req.user._id, function(err, data){
        if(err) throw err;
        if(data) {
            Object.keys(data).forEach(function (key) {
                for_send.push(data[key]);
            });
        }
        res.send(for_send);
    });

});