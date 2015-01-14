var mongoose = require('mongoose');

var SocketSchema = new mongoose.Schema({
    socket_id: String,
    user_id: String
});
var Socket = mongoose.model("Socket", SocketSchema);

module.exports = Socket;
