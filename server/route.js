var Server = require('../server');
var app = Server.app;
var msgsCtrl = require('./controllers/msgs');
var authCtrl = require('./controllers/auth');
var userCtrl = require('./controllers/user');
var friendsCtrl = require('./controllers/friends');

app.post('/login', authCtrl.login);
app.post('/users/me', authCtrl.signUpValidation, authCtrl.signUp);
app.get('/users/me', authCtrl.getCurrentUser);
app.get('/sign_out', authCtrl.signOut);

app.get('/users', userCtrl.getAllUsers);
app.get('/user/:id', userCtrl.getUserById);

app.post('/friends/:id', friendsCtrl.addFriend);
app.delete('/friends/:id', friendsCtrl.removeFriend);

app.get('/dialogues', msgsCtrl.getDialogues);
app.get('/dialogue/:id', msgsCtrl.getDialogue);
