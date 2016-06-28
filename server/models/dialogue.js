var mongoose = require('mongoose');

var DialogueSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    msgs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Msg'
    }]
});

var Dialogue = mongoose.model('Dialogue', DialogueSchema);

module.exports = Dialogue;
