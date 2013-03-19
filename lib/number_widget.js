var util = require('util')
  , moment = require('moment')
  , Widget = require('./widget');

function NumberWidget() {
  Widget.apply(this, arguments);
}

util.inherits(NumberWidget, Widget);

NumberWidget.prototype.serialize = function(callback) {
  var attributes = {name: this.name};
  var that = this;
  if (this.redisClient) {
    this.redisClient.hget(this.name, 'value', function(err, res) {
      if (err) throw err;
      attributes.value = res;
      console.log('redis get value ' + that.name + ' ' + res);
      that.redisClient.hget(that.name, 'timestamp', function(err, res) {
        if (err) throw err;
        attributes.timestamp = res;
        console.log('redis get timestamp ' + that.name + ' ' + res);
        if (typeof callback === 'function') callback(null, attributes);
      });
    });
  } else {
    console.log('No Redis client to get state!');
  }
  return this;
};

// NOTE: forget about history for now, just concentrate on getting a number
// stored and updated, but think about how you would add history later

// TODO: clean this up, separate SET VALUE and UPDATE VALUE in different 
// functions, maybe use async to organize callbacks
NumberWidget.prototype.update = function(data, callback) {
  var that = this;
  // TODO: maybe check if data is valid?
  // SET VALUE
  if (data.value) {
    var value = data.value;
    if (this.redisClient) {
      this.redisClient.hset(this.name, 'value', value, function(err, res) {
        // TODO: check right way to do this, maybe `return callback(err)`?
        if (err) throw err;
        // Carefull, `res` is "OK" when setting a value
        console.log('redis set value ' + that.name + ' ' + value);
        var timestamp = data.timestamp;
        if (!timestamp) timestamp = moment().format();
        that.redisClient.hset(that.name, 'timestamp', timestamp, function(err, res) {
          if (err) throw err;
          console.log('redis set timestamp ' + that.name + ' ' + timestamp);
          that.serialize(function(err, attributes) {
            if (err) throw err;
            that.emit('update', attributes);
            if (typeof callback === 'function') callback(null, attributes);
          });
        });
      });
    } else {
      console.log('No Redis client to persist state!');
    }
  // UPDATE VALUE
  } else if (data.delta) {
    var delta = data.delta;
    if (this.redisClient) {
      // Make sure delta is an integer, a float will give an error
      delta = parseInt(delta);
      this.redisClient.hincrby(this.name, 'value', delta, function(err, res) {
        if (err) throw err;
        // When incrementing, `res` is the updated value
        console.log('redis update value ' + that.name + ' ' + res);
        var timestamp = data.timestamp;
        if (!timestamp) timestamp = moment().format();
        that.redisClient.hset(that.name, 'timestamp', timestamp, function(err, res) {
          if (err) throw err;
          console.log('redis set timestamp ' + that.name + ' ' + timestamp);
          // TODO: this is repeated form the SET VALUE part
          that.serialize(function(err, attributes) {
            if (err) throw err;
            that.emit('update', attributes);
            if (typeof callback === 'function') callback(null, attributes);
          });
        });
      });
    } else {
      console.log('No Redis client to persist state!');
    }
  }
  return this;
};


module.exports = NumberWidget;