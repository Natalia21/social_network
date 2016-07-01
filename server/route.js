var Server = require('../server'),
	app    = Server.app;

var msgsCtrl    = require('./controllers/msgs'),
	authCtrl    = require('./controllers/auth'),
    userCtrl    = require('./controllers/user'),
    friendsCtrl = require('./controllers/friends');

/* ------------------------AUTH----------------------------*/

app.post('/login', authCtrl.login);

app.post('/users/me', authCtrl.signUpValidation, authCtrl.signUp);

app.get('/users/me', authCtrl.getCurrentUser);

app.get('/sign_out', authCtrl.signOut);

/*-------------------------USER----------------------------*/

app.get('/users', userCtrl.getAllUsers);

app.get('/user/:id', userCtrl.getUserById);

/*------------------------FRIENDS---------------------------*/

app.post('/friends/:id', friendsCtrl.addFriend);

app.delete('/friends/:id', friendsCtrl.removeFriend);

/*-------------------------MSGS-----------------------------*/

app.get('/dialogues', msgsCtrl.getDialogues);

app.get('/dialogue/:id', msgsCtrl.getDialogue);
