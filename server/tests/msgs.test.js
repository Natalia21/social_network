var app = require('../../server');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');
var io_client = require('socket.io-client');
var User = require('../models/user');
var Dialogue = require('../models/dialogue');
var Msg = require('../models/msg');

var base_url = 'http://localhost:8888';
var agent = request.agent(base_url);

var user_1 = {
	first_name: 'ivan',
	last_name: 'test',
	email: 'ivan@mail.com',
	password: '12345ivan'
};
var user_2 = {
	first_name: 'oleg',
	last_name: 'test',
	email: 'oleg@mail.com',
	password: '12345oleg'
};
var options ={
    transports: ['websocket'],
    'force new connection': true
};

var client_1 = null;
var client_2 = null;

describe('msg', function () {
	beforeEach(function (done) {
		async.parallel([
			function (cb) {
				User.remove({}, function (err) {
					cb(err);
				});
			},
			function (cb) {
				Dialogue.remove({}, function (err) {
					cb(err);
				});
			},
			function (cb) {
				Msg.remove({}, function (err) {
					cb(err);
				});
			}
		], function (err) {
			if ( err ) throw err;

			async.each(
				[user_1, user_2], 
				function (user, callback) {
					new User(user).save(function (err, data) {
						user.id = data._id;
						callback(err);
					});
				},
				function (err) {
					if ( err ) throw err;
					client_1 = io_client.connect(base_url, options);
					client_1.on('connect', function () {
						client_1.emit('add_user', {
							id: user_1.id
						});
					});
					client_2 = io_client.connect(base_url, options);
					client_2.on('connect', function () {
						client_2.emit('add_user', {
							id: user_2.id
						});
					});
					agent.post('/login')
						 .send({
						 	email: user_1.email,
						 	password: user_1.password
						 })
						 .end(function (err) {
						 	if ( err ) throw err;
						 	client_1.emit('send_msg', {
						 		to: user_2.id,
						 		text: 'hello'
						 	});
						 	done();
						 });
				});
		});
	});

	afterEach(function () {
		client_1.disconnect();
		client_2.disconnect();
	});

	describe('getDialogues()', function () {
		it('should return dialogues', function (done) {
			this.timeout(3000);
			setTimeout(function () {
				agent.get('/dialogues')
					 .end(function (err, res) {
					 	expect(err).to.be.null;
						expect(res.status).to.be.equal(200);
						expect(res.body).to.have.length(1);
						expect(res.body[0]['msgs']).to.have.length(1);
						expect(res.body[0]['msgs'][0]['from']).to.have.property('first_name', 'ivan');
						expect(res.body[0]['msgs'][0]['from']).to.have.property('last_name', 'test');
						expect(res.body[0]['msgs'][0]['from']).to.not.have.property('password');
						expect(res.body[0]['msgs'][0]['from']).to.not.have.property('friends');
						expect(res.body[0]['msgs'][0]['from']).to.not.have.property('subscriptions');
						expect(res.body[0]['msgs'][0]['from']).to.not.have.property('followers');
						expect(res.body[0]['msgs'][0]['to']).to.have.property('first_name', 'oleg');
						expect(res.body[0]['msgs'][0]['to']).to.have.property('last_name', 'test');
						expect(res.body[0]['msgs'][0]['to']).to.not.have.property('password');
						expect(res.body[0]['msgs'][0]['to']).to.not.have.property('friends');
						expect(res.body[0]['msgs'][0]['to']).to.not.have.property('subscriptions');
						expect(res.body[0]['msgs'][0]['to']).to.not.have.property('followers');
						expect(res.body[0]['msgs'][0]['text']).to.be.equal('hello');
						done();
					 });
			}, 2000);
		});

		it('should return nothing if user is not logged in', function (done) {
			agent.get('/sign_out')
				 .end(function (err) {
				 	if ( err ) throw err;
			 		agent.get('/dialogues')
			 			 .end(function (err, res) {
			 			 	expect(err).to.be.null;
			 				expect(res.status).to.be.equal(200);
			 				expect(res.body).to.have.length(0);
			 				done();
			 			 });
				 });
		});
	});

	describe('getDialogue()', function () {
		it('should return dialogue by id', function (done) {
			this.timeout(3000);
			setTimeout(function () {
				agent.get('/dialogues')
					 .end(function (err, res) {
					 	expect(1).to.be.equal(1);
						var id = res.body[0]._id;
						agent.get('/dialogues/' + id)
							 .end(function (err, res) {
							 	expect(err).to.be.null;
							 	expect(res.body['msgs']).to.have.length(1);
							 	expect(res.body['msgs'][0]['from']).to.have.property('first_name', 'ivan');
							 	expect(res.body['msgs'][0]['from']).to.have.property('last_name', 'test');
							 	expect(res.body['msgs'][0]['from']).to.not.have.property('password');
							 	expect(res.body['msgs'][0]['from']).to.not.have.property('friends');
							 	expect(res.body['msgs'][0]['from']).to.not.have.property('subscriptions');
							 	expect(res.body['msgs'][0]['from']).to.not.have.property('followers');
							 	expect(res.body['msgs'][0]['to']).to.have.property('first_name', 'oleg');
							 	expect(res.body['msgs'][0]['to']).to.have.property('last_name', 'test');
							 	expect(res.body['msgs'][0]['to']).to.not.have.property('password');
							 	expect(res.body['msgs'][0]['to']).to.not.have.property('friends');
							 	expect(res.body['msgs'][0]['to']).to.not.have.property('subscriptions');
							 	expect(res.body['msgs'][0]['to']).to.not.have.property('followers');
							 	expect(res.body['msgs'][0]['text']).to.be.equal('hello');
							 	done();
							 });
					 });
			}, 2000);
		});

		it('should return null is such id is not exist', function (done) {
			this.timeout(3000);
			setTimeout(function () {
				var id = mongoose.Types.ObjectId();
				agent.get('/dialogues/' + id)
					 .end(function (err, res) {
					 	expect(err).to.be.null;
					 	expect(res.status).to.be.equal(200);
					 	expect(res.body).to.be.empty;
					 	done();
					 });
			}, 2000);
		});
	});
});
