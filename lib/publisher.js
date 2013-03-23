var debug = require('debug')('motherboard:publisher');

// `Publisher` reacts to widget updates and publishes them to:
// 
// - browser clients to update their UI
// - other instances of this app
// 
// For these, it uses respectively WebSockets and Redis Pub/Sub.

// Constructor
// Takes an `options` object with:
// - `sockets`: WebSockets client
// - `redisClient`: Redis client for publishing
// - `redisClientSubscriber`: other Redis client that will be locked 
// in 'subscribe' mode
function Publisher(options) {
  if (!options) options = {};
  if (options.sockets) this.sockets = options.sockets;
  if (options.redisClient && options.redisClientSubscriber) {
    this.usingRedis = true;
    this.redisClient = options.redisClient;
    this.redisClientSubscriber = options.redisClientSubscriber;
    this.subscribeRedis();
  }
}

// On widget update, publish its new attributes
Publisher.prototype.publish = function(widgetAttributes) {
  debug('publishing %s', JSON.stringify(widgetAttributes));
  // If using redis to coordinate between multiple instances of the app,
  // publish through Redis Pub/Sub, witch will trigger a WebSocket publish
  if (this.usingRedis) {
    this.publishRedis(widgetAttributes);
  // Else publish directly through WebSockets
  } else {
    this.publishSockets(widgetAttributes);
  }
};

Publisher.prototype.publishSockets = function(widgetAttributes) {
  if (this.sockets) {
    debug('publishing sockets %s', widgetAttributes.name);
    this.sockets.emit('widget:update', widgetAttributes);
  }
};

Publisher.prototype.publishRedis = function(widgetAttributes)  {
  if (this.redisClient) {
    debug('publishing redis %s', widgetAttributes.name);
    this.redisClient.publish('widget:update', JSON.stringify(widgetAttributes));
  }
};

// Listen on Redis Pub/Sub for 'widget:update' message, 
// and publish it through WebSockets
Publisher.prototype.subscribeRedis = function() {
  if (this.redisClientSubscriber) {
    var that = this;
    this.redisClientSubscriber.on('message', function(channel, message) {
      var widgetAttributes = JSON.parse(message);
      that.publishSockets(widgetAttributes);
    });
    this.redisClientSubscriber.subscribe('widget:update');
  }
};

module.exports = Publisher;