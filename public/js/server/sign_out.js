var Server = require('../../../server');
var app = Server.app;

app.post("/sign_out", function(req, res) {
    delete req.session.authorized;
    delete req.session.email;
    res.send({text: 'OK'});
});