var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , debug = require('debug')('motherboard:listener');

// `Listener` captures external 'data events' on a set of 'data channels', 
// and transfers that event to the rest of the app (the widgets in particular).
// 
// A 'data event' is something that causes a widget to change its value,
// like a new user registration would change the "registered users" widget.
// 
// The implementation below receives data events through HTTP POST with a
// JSON request body, but we could add other transports 
// (like a messaging service: Redis Pub/Sub, RabbitMQ, etc.)

// Constructor
// Takes an `options` objects that contains:
// - `channels`: a list of channel names to capture data events on
// - `app`: the Express app for the HTTP implementation
function Listener(options) {
  this.channels = [];
  if (!options) options = {};
  if (options.channels) this.channels = options.channels;
  if (options.app) this.app = options.app;
  this.initialize();
}

// Extend `EventEmitter`
util.inherits(Listener, EventEmitter);

// Set up the HTTP POST endpoints
Listener.prototype.initialize = function() {
  var that = this;
  if (this.app) {
    this.app.post('/channels/:channel', function(req, res) {
      // Note: client sending HTTP request should have
      // Content-Type: application/json
      if (req.headers['content-type'] !== 'application/json') {
        debug('Warning: "content-type" header is not "application/json"');
      }
      var channel = req.params.channel;
      if (_.contains(that.channels, channel)) {
        var data = req.body;
        if (that.isValidChannelData(data)) {
          debug('on %s captured %s', channel, JSON.stringify(data));
          that.emit(channel, data);
          res.send({success: 'ok'});
        } else {
          res.send(400, {error: 'Bad channel data'});
        }
      } else {
        res.send(404, {error: 'Unknown channel'});
      }
    });
  }
  return this;
};

// Validate data event
Listener.prototype.isValidChannelData = function(data) {
  if (typeof data === 'object' && !_.isEmpty(data)) {
    return true;
  } else {
    return false;
  }
};

module.exports = Listener;