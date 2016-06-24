var config = {};
var redisURL = url.parse(process.env.REDISCLOUD_URL) || {host: 'localhost', port: 6379};

config.port = 8888;
config.db = 'mongodb://localhost/test';
config.redis = {
	host: redisURL.hostname,
	port: redisURL.port,
	db: 2
}

module.exports = config;
