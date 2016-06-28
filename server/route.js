var Server = require('../server'),
	app    = Server.app;

var msgsCtrl    = require('./controllers/msgs'),
	authCtrl    = require('./controllers/auth'),
    userCtrl    = require('./controllers/user'),
    friendsCtrl = require('./controllers/friends');

/* ------------------------AUTH----------------------------*/

app.get('/login/:email/:password', authCtrl.login);

app.post('/current_user', authCtrl.signUpValidation, authCtrl.signUp);

app.get('/current_user', authCtrl.getCurrentUser);

app.post('/sign_out', authCtrl.signOut);

/*-------------------------USER----------------------------*/

app.get('/users', userCtrl.getAllUsers);

app.get('/user/:id', userCtrl.getUserById);

/*------------------------FRIENDS---------------------------*/

app.post('/add_friend', friendsCtrl.addFriend);

app.post('/remove_friend', friendsCtrl.removeFriend);

/*-------------------------MSGS-----------------------------*/

app.get('/dialogues', msgsCtrl.getDialogues);

app.get('/dialogue/:id', msgsCtrl.getDialogue);
