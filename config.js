var config = {};

config.port = 8888;
config.db = 'mongodb://localhost/test';
config.redis = {
	host: 'localhost',
	port: 6379,
	db: 2
}

module.exports = config;
