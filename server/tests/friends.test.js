var app = require('../../server');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');
var User = require('../models/user');

var base_url = 'http://localhost:8888';

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

describe('friends', function () {

	var agent = request.agent(base_url);

	beforeEach(function (done) {
		User.remove({}, function (err) {
			if ( err ) throw err;

			async.each(
				[user_1, user_2], 
				function (user, cb) {
					new User(user).save(function (err, data) {
						user.id = data._id;
						cb(err);
					});
				},
				function (err) {
					if ( err ) throw err;
					done();
				});
		});
	});

	describe('subscriptions', function () {

		beforeEach(function (done) {
			agent.post('/login')
				 .send({
				 	email: user_1.email,
				 	password: user_1.password
				 })
				 .end(function (err, res) {
					if ( err ) throw err;
					done();
				});
		});

		it('should add new user to subscriptions', function (done) {
			agent.post('/friends/' + user_2.id)
				 .end(function (err, res) {
				 	agent.get('/users/me')
				 		.end(function (err, res) {
				 			expect(res.body.followers).to.have.length(0);
				 			expect(res.body.friends).to.have.length(0);
				 			expect(res.body.subscriptions).to.have.length(1);
				 			expect(res.body.subscriptions[0]).to.have.property('first_name', 'oleg');
				 			expect(res.body.subscriptions[0]).to.have.property('last_name', 'test');
				 			expect(res.body.subscriptions[0]).to.have.property('email', 'oleg@mail.com');
				 			expect(res.body.subscriptions[0]).to.not.have.property('password');

				 			done();
				 		});
				});
		});

		it('should remove user from subscriptions', function (done) {
			agent.delete('/friends/' + user_2.id)
				 .end(function (err, res) {
				 	agent.get('/users/me')
				 		.end(function (err, res) {
				 			expect(res.body.followers).to.have.length(0);
				 			expect(res.body.friends).to.have.length(0);
				 			expect(res.body.subscriptions).to.have.length(0);

				 			done();
				 		});
				 });
		});
	});

	describe('friends', function () {
		beforeEach(function (done) {
			agent.post('/login')
				 .send({
				 	email: user_2.email,
				 	password: user_2.password
				 })
				 .end(function (err, res) {
					if ( err ) throw err;
					done();
				});
		});

		it('should add new user to friend and remove from followers', function () {
			agent.post('/friends/' + user_1.id)
				 .end(function (err, res) {
				 	if ( err ) throw err;
				 	agent.get('/users/me')
				 		.end(function (err, res) {
				 			expect(res.body.subscriptions).to.have.length(0);
				 			expect(res.body.followers).to.have.length(0);
				 			expect(res.body.friends).to.have.length(1);
				 			expect(res.body.friends[0]).to.have.property('first_name', 'ivan');
				 			expect(res.body.friends[0]).to.have.property('last_name', 'test');
				 			expect(res.body.friends[0]).to.have.property('email', 'ivan@mail.com');
				 			expect(res.body.friends[0]).to.not.have.property('password');

				 			done();
				 		});
				});
		});

		it('should add new user to friend and remove from followers', function () {
			agent.delete('/friends/' + user_1.id)
				 .end(function (err, res) {
				 	agent.get('/users/me')
				 		.end(function (err, res) {
				 			expect(res.body.subscriptions).to.have.length(0);
				 			expect(res.body.followers).to.have.length(0);
				 			expect(res.body.friends).to.have.length(0);

				 			done();
				 		});
				 });

		});
	});

});
