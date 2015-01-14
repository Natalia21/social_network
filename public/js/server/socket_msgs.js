var Server = require('../../../server');
var io = Server.io;
var Socket = Server.Socket;
var User = Server.User;

io.sockets.on('connection', function (socket) {
    var ID = socket.handshake.query.ID;
    console.log('connected socket.id');
    console.log(socket.id);
    Socket.find({user_id: ID}, function(err, data){
        if(err) throw err;
        if(!data[0]){
            console.log('in if');
            var new_user = new Socket({socket_id: socket.id, user_id: ID});
            new_user.save(function(err, data){
                if(err) throw err;
            });
        }
        else{
            console.log('in else');
            Socket.update({user_id: ID}, {$set: {socket_id: socket.id}})
        }
    });

    socket.on('message_to_server', function (message) {
        var message = {
            from: ID,
            to: message.to,
            text: message.message,
            time: (new Date).toLocaleTimeString()
        };
        try {
            User.update({_id: ID}, {$push:{messages: message}}, function(err, data){
                if(err) throw err;
            });
            User.update({_id: message.to}, {$push:{messages: message}}, function(err, data){
                if(err) throw err;
            });
            socket.emit('message_to_me', message);
            Socket.find({user_id: message.to}, function(err, data){
                if(err) throw err;
                if(data[0]) {
                    console.log('here');
                  //  console.log(io.sockets.connected);
                    console.log(data[0].socket_id);
                 //   console.log(io.sockets.connected)
                    if (io.sockets.connected[data[0].socket_id]) {
                        console.log('here2');
                        io.sockets.connected[data[0].socket_id].emit('message_to_user', message);
                    }
                   // io.to(data[0].socket_id).emit('message_to_user', message);
                }
            })
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('disconnect', function() {
        Socket.remove({socket_id: socket.id}, function(err, data){
            console.log(data);
            if(err) throw  err;
        });
        console.log('disconnected ' + socket.id)
    });

});
