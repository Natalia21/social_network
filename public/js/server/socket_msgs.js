var Server = require('../../../server');
var io = Server.io;
var User = Server.User;
var Message = Server.Message;
var client = Server.client;

var sockets = [];

io.sockets.on('connection', function (socket) {
    var ID = socket.handshake.query.ID;
    sockets.push({user_id: ID, socket_id: socket.id});
    socket.on('message_to_server', function (message) {
        var message = {
            from: ID,
            to: message.to,
            text: message.message,
            time: (new Date).toLocaleTimeString()
        };
        try {
            var msg = new Message(message);
            msg.save(function(err){
                if(err) throw err;
            });

            client.hset(message.from, message.to, '{"from": "' + message.from + '", "to": "' + message.to + '", "text": "' + message.text + '", "time": "' + message.time + '"}');
            client.hset(message.to, message.from, '{"from": "' + message.from + '", "to": "' + message.to + '", "text": "' + message.text + '", "time": "' + message.time + '"}');

            socket.emit('message_to_me', message);

            for(var i = 0; i < sockets.length; i++){
                if(sockets[i].user_id == message.to){
                    io.sockets.connected[sockets[i].socket_id].emit('message_to_user', message);
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('disconnect', function() {
        for(var i = 0; i < sockets.length; i++) {
            if(sockets[i].socket_id == socket.id){
                sockets.splice(i, 1);
            }
        }
    });

});