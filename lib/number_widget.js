var util = require('util')
  , moment = require('moment')
  , Widget = require('./widget')
  , debug = require('debug')('motherboard:number_widget');

// `NumberWidget` extends the `Widget` base class.
// 
// The Number Widget is a very basic widget that keeps track of a single
// integer value, and resets it if it receives a 'value' data event, or 
// increments/decrements it if it receives a 'delta' data event.
// It also keeps a timestamp (ISO 8601) of the last change to its value.

// Constructor
function NumberWidget() {
  // Call parent constructor
  Widget.apply(this, arguments);
}

// Extend base `Widget` class
util.inherits(NumberWidget, Widget);

// Return object representation of widget's attributes to callback
NumberWidget.prototype.serialize = function(callback) {
  var attributes = {name: this.name};
  var that = this;
  if (this.redisClient) {
    // Get first attribute from Redis store: 'value'
    this.redisClient.hget(this.name, 'value', function(err, res) {
      if (err) throw err;
      attributes.value = res;
      debug('redis get value %s %s', that.name, res);
      // Get second attribute form Redis store: 'timestamp'
      that.redisClient.hget(that.name, 'timestamp', function(err, res) {
        if (err) throw err;
        attributes.timestamp = res;
        debug('redis get timestamp %s %s', that.name, res);
        // Return attributes to callback
        if (typeof callback === 'function') callback(null, attributes);
      });
    });
  } else {
    debug('No Redis client to get state!');
  }
  return this;
};

// Handle a data event by updating the widget's attributes and passing them
// the the callback, and emitting an 'update' event with the attributes
NumberWidget.prototype.update = function(data, callback) {
  var that = this;
  // TODO: check that data is valid?
  // If both 'value' and 'delta' are present in data, 'value' has priority
  if (data.value) {
    this.resetValue(data.value, data.timestamp, function() {
      that.publishUpdate(callback);
    });
  } else if (data.delta) {
    this.modifyValue(data.delta, data.timestamp, function() {
      that.publishUpdate(callback);
    });
  }
  return this;
};

NumberWidget.prototype.resetValue = function(value, timestamp, callback) {
  var that = this;
  if (this.redisClient) {
    this.redisClient.hset(this.name, 'value', value, function(err, res) {
      if (err) throw err;
      // Carefull, `res` is "OK" when setting a value, not the value
      debug('redis reset value %s %s', that.name, value);
      that.setTimestamp(timestamp, callback);
    });
  } else {
    debug('No Redis client to get state!');
  }
  return this;
};

NumberWidget.prototype.modifyValue = function(delta, timestamp, callback) {
  var that = this;
  if (this.redisClient) {
    // Make sure delta is an integer, a float will give an error
    delta = parseInt(delta, 10);
    this.redisClient.hincrby(this.name, 'value', delta, function(err, res) {
      if (err) throw err;
      // When incrementing, `res` is the updated value
      debug('redis modify value %s %s', that.name, res);
      that.setTimestamp(timestamp, callback);
    });
  } else {
    debug('No Redis client to get state!');
  }
  return this;
};

NumberWidget.prototype.setTimestamp = function(timestamp, callback) {
  var that = this;
  // If no timestamp given, use current time
  if (!timestamp) timestamp = moment().format();
  this.redisClient.hset(this.name, 'timestamp', timestamp, function(err, res) {
    if (err) throw err;
    debug('redis set timestamp %s %s', that.name, timestamp);
    if (typeof callback === 'function') callback();
  });
  return this;
};

NumberWidget.prototype.publishUpdate = function(callback) {
  var that = this;
  this.serialize(function(err, attributes) {
    if (err) throw err;
    that.emit('update', attributes);
    if (typeof callback === 'function') callback(null, attributes);
  });
  return this;
};

module.exports = NumberWidget;