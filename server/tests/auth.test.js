var app = require('../../server');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');
var User = require('../models/user');

var base_url = 'http://localhost:8888';

var user = {
	first_name: 'ivan',
	last_name: 'test',
	email: 'example@mail.com',
	password: '12345'
};

describe('auth', function () {

	var agent = request.agent(base_url);

	describe('login()', function () {
		beforeEach(function (done) {
			User.remove({}, function (err) {
				if ( err ) throw err;

				new User(user).save(function (err, data) {
					if (err) throw err;
					done();
				});
			});
		});

		it('should login user', function (done) {
			agent.get('/login/example@mail.com/12345')
				 .end(function (err, res) {
					expect(res.body.first_name).to.equal('ivan');
					expect(res.body.last_name).to.equal('test');
					expect(res.body.email).to.equal('example@mail.com');
					expect(res.body.password).to.be.undefined;

					done();
				});
		});

		it('should return error if user password is incorrect', function (done) {
			var id = mongoose.Types.ObjectId();

			agent.get('/login/example@mail.com/1234')
				 .end(function (err, res) {
					expect(res.status).to.equal(500);
					expect(res.body.first_name).to.be.undefined;
					expect(res.body.last_name).to.be.undefined;
					expect(res.body.email).to.be.undefined;

					done();
				});
		});

		it('should return error if user email is incorrect', function (done) {
			var id = mongoose.Types.ObjectId();

			agent.get('/login/incorrect@mail.com/12345')
				 .end(function (err, res) {
					expect(res.status).to.equal(500);
					expect(res.body.first_name).to.be.undefined;
					expect(res.body.last_name).to.be.undefined;
					expect(res.body.email).to.be.undefined;

					done();
				});
		});

	});

	describe('signUp()', function () {
		beforeEach(function (done) {
			User.remove({}, function (err) {
				if ( err ) throw err;
				done();
			});
		});

		it('should sing up user', function (done) {
			agent.post('/current_user')
				 .send(user)
				 .end(function (err, res) {
				 	expect(res.status).to.equal(200);
				 	expect(res.body._id).to.not.be.undefined;

				 	done();
				 });
		});

		it('should return error if user with such email has already exist', function (done) {
			new User(user).save(function (err) {
				if ( err ) throw err;

				agent.post('/current_user')
					 .send(user)
					 .end(function (err, res) {
					 	expect(res.status).to.equal(500);
					 	expect(res.body.first_name).to.be.undefined;
					 	expect(res.body.last_name).to.be.undefined;
					 	expect(res.body.email).to.be.undefined;

					 	done();
					 });
			});
		});

	});

	describe('getCurrentUser()', function () {

		beforeEach(function (done) {
			User.remove({}, function (err) {
				if ( err ) throw err;

				new User(user).save(function (err, data) {
					if (err) throw err;
					done();
				});
			});
		});

		it('should return correct user data', function (done) {
			agent.get('/login/example@mail.com/12345')
				 .end(function (err, res) {
					if ( err ) throw err;
					agent.get('/current_user')
						 .end(function (err, res) {
							expect(res.body.first_name).to.be.equal('ivan');
							expect(res.body.last_name).to.equal('test');
							expect(res.body.email).to.equal('example@mail.com');
							expect(res.body.password).to.be.undefined;

							done();
						});
				});
		});

		it('should return error if authentication is failed', function (done) {
			agent.get('/current_user')
				 .end(function (err, res) {
					expect(res.status).to.be.equal(500);
					expect(res.body.first_name).to.be.undefined;
					expect(res.body.last_name).to.be.undefined;
					expect(res.body.email).to.be.undefined;

					done();
				});
		});
	});
});
