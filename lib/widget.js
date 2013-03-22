var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , debug = require('debug')('motherboard:widget');

// `Widget` is the base class for all widget.
// 
// On the server, a widget is reponsible for updating 
// and persisting a key metric.
// 
// The public functions are:
// 
// - the constructor `Widget(name, options)`
// - `Widget#serialize` returns an object representation of the widget's 
// current data
// - `Widget#update` updates the widget's data according to a "data event" on
// the data channel(s) the widget is listening to

// Constructor
// A widget has a unique `name` which is used by a `Publisher` to broadcast
// changes to its attributes' values
// It also takes an `options` object that can contain:
// - `channels`: a list of incoming data channels the widget wants to listen to
// - `redisClient`: given to persist the widget's state to a Redis datastore
function Widget(name, options) {
  this.name = name;
  this.channels = [];
  if (!options) options = {};
  if (options.channels) this.channels = options.channels;
  if (options.redisClient) this.redisClient = options.redisClient;
}

// Extend `EventEmitter`
util.inherits(Widget, EventEmitter);

// Override this with business logic get and object representation
// of the current state of widget's attributes that you pass to the callback
Widget.prototype.serialize = function(callback) {
  throw new Error('Widget#serialize must be overridden by subclass');
};

// Override this with business logic to process data events
// and compute new widget attributes, as well as persist them in a data store
// Pass the new attributes as an object to the callback and emit an 'update'
// event with the attributes
Widget.prototype.update = function(data, callback) {
  throw new Error('Widget#update must be overridden by subclass');
};

// Give the widget a Redis client to use after the widget has been created
Widget.prototype.setRedisClient = function(redisClient) {
  this.redisClient = redisClient;
  debug('set redis client for %s', this.name);
  return this;
};

module.exports = Widget;