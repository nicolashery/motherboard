var util = require('util');

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

Publisher.prototype.publish = function(widgetAttributes) {
  console.log(widgetAttributes);
  // If using redis to coordinate between different instances of the app,
  // publish through redis pub/sub
  if (this.usingRedis) {
    this.publishRedis(widgetAttributes);
  // Else publish directly through websockets
  } else {
    this.publishSockets(widgetAttributes);
  }
};

Publisher.prototype.publishSockets = function(widgetAttributes) {
  if (this.sockets) {
    console.log('publishing sockets ' + widgetAttributes.name);
    this.sockets.emit('widget:update', widgetAttributes);
  }
};

Publisher.prototype.publishRedis = function(widgetAttributes)  {
  if (this.redisClient) {
    console.log('publishing redis ' + widgetAttributes.name);
    this.redisClient.publish('widget:update', JSON.stringify(widgetAttributes));
  }
};

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