var http = require('http')
  , url = require('url')
  , _ = require('lodash')
  , debug = require('debug')('motherboard:producer');

// `Producer` is simply a worker that sends data events to the app's
// HTTP API, to trigger widget updates. It is used in the demo, and
// can be in place or in addition to sending these HTTP data events through
// another library or mechanism.

function Producer(channel, options) {
  this.channel = channel;
  if (!options) options = {};
  if (options.httpEndpoint) this.httpEndpoint = options.httpEndpoint;
  if (options.getInitial) this.getInitial = options.getInitial;
  this.updateInterval = options.updateInterval || 1000;
  if (options.getUpdate) this.getUpdate = options.getUpdate;
}

Producer.prototype.run = function() {
  // Send initial value for data channel
  this.checkForChannelInitial();
  // Poll data channel for updates
  setInterval(_.bind(this.checkForChannelUpdate, this), this.updateInterval);
  debug('started producer on channel %s', this.channel);
};

Producer.prototype.checkForChannelInitial = function() {
  var that = this;
  this.getInitial(function(err, data) {
    if (err) throw err;
    that.sendChannelUpdate(data);
  });
};

Producer.prototype.checkForChannelUpdate = function() {
  var that = this;
  this.getUpdate(function(err, data) {
    if (err) throw err;
    that.sendChannelUpdate(data);
  });
};

// Override this with how to fetch a potential update on a data channel
// If there is an update, pass the data to the callback as second parameter
// Data needs to be a valid object that will be sent as JSON to the app's API
Producer.prototype.getUpdate = function(callback) {
  throw new Error('Producer#getUpdate must be overridden by subclass');
  /* ex:
  var data;
  // Only create event 2 out of 3 times
  if (Math.random() > 0.33 ) {
    // Go up half the time, down the other half
    if (Math.random() < 0.5) {
      data = {delta: 1};
    } else {
      data = {delta: -1};
    }
    callback(null, data);
  }
  */
};

// Optionally override this to get the initial value this data channel
// Will be run only once, when producer starts
// Data needs to be a valid object that will be sent as JSON to the app's API
Producer.prototype.getInitial = function(callback) {
  /* ex:
  var data = {
    value: 700,
    timestamp: '2013-03-19T19:02:38-04:00'
  };
  callback(null, data);
  */
};

Producer.prototype.sendChannelUpdate = function(data) {
  if (this.httpEndpoint) {
    debug('sending data event on %s %s', this.channel, JSON.stringify(data));
    var req = this.createHttpRequest(data);
    // Send the request
    req.end();
  }
};

Producer.prototype.createHttpRequest = function(data) {
  var parsedUrl = url.parse(this.httpEndpoint + '/' + this.channel);
  var options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  };
  req = http.request(options, function(res) {
    debug('HTTP response status: %s', res.statusCode);
  });
  req.write(JSON.stringify(data));
  return req;
};

module.exports = Producer;