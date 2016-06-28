var mongoose = require('mongoose');

var MsgSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
    	type: Date
    },
    text: {
    	type: String
    }
});

var Msg = mongoose.model('Msg', MsgSchema);

module.exports = Msg;
