var mongoose = require('mongoose');

var MsgSchema = new mongoose.Schema({
    from: String,
    to: String,
    text: String,
    time: String
});
var Message = mongoose.model('Message', MsgSchema);

module.exports = Message;
