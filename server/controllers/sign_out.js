var Server = require('../../server');
var app = Server.app;

app.post('/sign_out', function(req, res) {
    req.logout();
    res.send({text: 'OK'});
});