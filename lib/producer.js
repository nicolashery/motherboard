var http = require('http')
  , url = require('url')
  , _ = require('lodash');

function Producer(channel, options) {
  this.channel = channel;
  if (!options) options = {};
  if (options.httpEndpoint) this.httpEndpoint = options.httpEndpoint;
  this.updateInterval = options.updateInterval || 1000;
  if (options.getUpdate) this.getUpdate = options.getUpdate;
}

Producer.prototype.run = function() {
  this.intervalId = setInterval(_.bind(this.checkForChannelUpdate, this)
  , this.updateInterval);
  console.log('Started producer on channel ' + this.channel);
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

Producer.prototype.sendChannelUpdate = function(data) {
  if (this.httpEndpoint) {
    console.log('Producer sending update on ' + this.channel);
    console.log(data);
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
    console.log('Producer HTTP request status: ' + res.statusCode);
  });
  req.write(JSON.stringify(data));
  return req;
};

module.exports = Producer;