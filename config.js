var url = require('url');
var config = {};

if ( process.env.NODE_ENV == 'production') {
	var redisURL = url.parse(process.env.REDISCLOUD_URL);
	config.db = process.env.MONGODB_URI;
	config.port = process.env.PORT;
} else {
	var redisURL = { hostname: 'localhost', port: 6379 };
	config.db = 'mongodb://localhost/test';
	config.port = 8888;
}

config.redis = {
	host: redisURL.hostname,
	port: redisURL.port,
	db: 2
}

module.exports = config;
