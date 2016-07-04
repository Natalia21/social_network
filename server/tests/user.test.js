var app = require('../../server');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');
var User = require('../models/user');

var base_url = 'http://localhost:8888';

describe('user', function () {

	var agent = request.agent(base_url);

	describe('getUserById()', function () {
		var user = {
			first_name: 'User',
			last_name: 'Example',
			email: 'example@mail.com',
			password: '12345'
		},
		id   = null;

		beforeEach(function (done) {
			User.remove({}, function (err) {
				if ( err ) throw err;
				new User(user).save(function (err, data) {
					if (err) throw err;
					id = data._id;
					done();
				});
			});

		});

		it('should return correct user data', function (done) {
			agent.get('/users/' + id)
				 .end(function (err, res) {
					expect(res.body.first_name).to.equal('User');
					expect(res.body.last_name).to.equal('Example');
					expect(res.body.email).to.equal('example@mail.com');
					expect(res.body.friends).to.be.undefined;
					expect(res.body.followers).to.be.undefined;
					expect(res.body.subscribtions).to.be.undefined;

					done();
				});
		});

		it('should return nothing if id is incorrect', function (done) {
			var id = mongoose.Types.ObjectId();

			agent.get('/users/' + id)
				 .end(function (err, res) {
					expect(res.body).to.be.empty;
					done();
				});
		});

	});

	describe('getAllUsers()', function () {

		beforeEach(function (done) {
			var users = [
			{
				'first_name': 'Ivan',
				'last_name': 'Example',
				'email': 'ivan@mail.com',
				'password': '12345'
			},
			{
				'first_name': 'Peter',
				'last_name': 'Example',
				'email': 'peter@mail.com',
				'password': '12345'
			},
			{
				'first_name': 'Vova',
				'last_name': 'Example',
				'email': 'vova@mail.com',
				'password': '12345'
			}];

			User.remove({}, function (err) {
				if ( err ) throw err;

				async.each(
					users, 
					function (user, cb) {
						new User(user).save(function (err, data) {
							cb(err);
						});
					},
					function (err) {
						if (err) throw err;
						agent.post('/login')
							 .send({
							 	email: users[0]['email'],
							 	password: users[0]['password']
							 })
							 .end(function (err, res) {
								if ( err ) throw err;
								done();
							});
					});
			});


		});

		it('should return users', function (done) {
			agent.get('/users')
				 .end(function (err, res) {
				 	expect(res.body).to.have.length(2);
				 	expect(res.body[0]).to.include.keys('first_name', 'last_name', 'email', 'is_a_friend', 'is_a_follower', 'is_in_subscriptions');
				 	expect(res.body[1]).to.include.keys('first_name', 'last_name', 'email', 'is_a_friend', 'is_a_follower', 'is_in_subscriptions');
				 	expect(res.body[0]).to.not.include.keys('password', 'friends', 'followers', 'subscriptions');
				 	expect(res.body[1]).to.not.include.keys('password', 'friends', 'followers', 'subscriptions');

					done();
				});
		});
	});
});
