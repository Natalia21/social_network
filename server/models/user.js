var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    friends: [{
    	'type': mongoose.Schema.Types.ObjectId,
    	'ref': 'User'
    }],
    subscriptions: [{
    	'type': mongoose.Schema.Types.ObjectId,
    	'ref': 'User'
    }],
    followers: [{
		'type': mongoose.Schema.Types.ObjectId,
		'ref': 'User'
    }]
});
var User = mongoose.model('User', UserSchema);

module.exports = User;
