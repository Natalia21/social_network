var url = require('url');
var config = {};

if ( process.env.NODE_ENV == 'production') {
	var redisURL = url.parse(process.env.REDIS_URL);
	var redisAuth = redisURL.auth.split(':');
	config.redis = {
		host: redisURL.hostname,
		port: redisURL.port,
		db: 0,
		pass: redisAuth[1],
		no_ready_check: true
	}
	config.db = process.env.MONGODB_URI;
	config.port = process.env.PORT;
} else {
	config.redis = { hostname: 'localhost',
					 port: 6379,
					 db: 2 };
	config.db = 'mongodb://localhost/test';
	config.port = 8888;
}

module.exports = config;
