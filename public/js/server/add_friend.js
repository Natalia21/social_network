var Server = require('../../../server');
var Friends = Server.Friends;
var app = Server.app;


app.post("/friends", function(req, res, next) {
    console.log(req.body);
    var new_friend = new Friends(req.body);
    new_friend.save();
});


