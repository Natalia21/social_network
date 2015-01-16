var mongoose = require('mongoose');

var FriendsSchema = new mongoose.Schema({
    from: String,
    to: String,
    confirm: Boolean
});
var Friends = mongoose.model("Friends", FriendsSchema);

module.exports = Friends;