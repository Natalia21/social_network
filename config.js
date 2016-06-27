var url = require('url');
var config = {};

var redisURL = { hostname: 'localhost', port: 6379 };

if ( process.env.REDISCLOUD_URL ) {
	console.log('inside');
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	console.log('redisURL ', redisURL);
}
config.port = 8888;
config.db = 'mongodb://localhost/test';
config.redis = {
	host: redisURL.hostname,
	port: redisURL.port,
	db: 2
}

module.exports = config;
