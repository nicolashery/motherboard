var redis = require('redis');

var createRedisClient = function() {
  var rtg, client;
  if (process.env.REDISTOGO_URL) {
    rtg = require('url').parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
  } else {
    client = exports.client  = redis.createClient();
  }
  return client;
};

module.exports = {
  createRedisClient: createRedisClient,
  redis: redis
};