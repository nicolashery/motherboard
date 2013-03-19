var util = require('util')
  , EventEmitter = require('events').EventEmitter;

function Widget(name, options) {
  this.name = name;
  this.channels = [];
  if (!options) options = {};
  if (options.channels) this.channels = options.channels;
  if (options.redisClient) this.redisClient = options.redisClient;
  // if (options.update) this.update = options.update;
}

util.inherits(Widget, EventEmitter);

// Public API
// Widget.prototype.onChannelData = function(data, callback) {
//   this.update(data, function(err, attributes) {
//     this.emit('update', attributes);
//     if (typeof callback === 'function') callback(err, attributes);
//   });
// };

// Optionally override this to provide more advanced data checking
// Widget.prototype.isValidChannelData = function(data) {
//   if (typeof data === 'object') {
//     return true;
//   } else {
//     return false;
//   }
// };

// Override this with business logic get and object representation
// of the current state of widget's attributes that you pass to the callback
Widget.prototype.serialize = function(callback) {
  throw new Error('Widget#serialize must be overridden by subclass');
};

// Override this with business logic to process data event
// and compute new widget attributes, as well as persist them in a data store
// Pass the new attributes as an object to the callback
Widget.prototype.update = function(data, callback) {
  throw new Error('Widget#update must be overridden by subclass');
};

Widget.prototype.setRedisClient = function(redisClient) {
  this.redisClient = redisClient;
  console.log('set redis client for ' + this.name);
  return this;
};

module.exports = Widget;