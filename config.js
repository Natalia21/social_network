var url = require('url');
var config = {};
var redisURL = process.env.REDIS_URL ? url.parse(process.env.REDISCLOUD_URL) : {hostname: 'localhost', port: 6379};

config.port = 8888;
config.db = 'mongodb://localhost/test';
config.redis = {
	host: redisURL.hostname,
	port: redisURL.port,
	db: 2
}

module.exports = config;
