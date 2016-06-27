var url = require('url');
var config = {};

/*if ( process.env.REDISCLOUD_URL ) {
	var redisURL = url.parse(process.env.REDISCLOUD_URL);
} else {
	var redisURL = { hostname: 'localhost', port: 6379 };
}
config.port = 8888;
config.db = 'mongodb://localhost/test';
config.redis = {
	host: redisURL.hostname,
	port: redisURL.port,
	db: 2
}*/

module.exports = config;
