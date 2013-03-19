var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash');

// Listen to incoming data channel for updates

function Listener(options) {
  this.channels = [];
  if (!options) options = {};
  if (options.channels) this.channels = options.channels;
  if (options.app) this.app = options.app;
  this.initialize();
}

util.inherits(Listener, EventEmitter);

Listener.prototype.initialize = function() {
  var that = this;
  if (this.app) {
    this.app.post('/channels/:channel', function(req, res) {
      // Note: client sending HTTP request better have
      // Content-Type: application/json
      // or else body won't get parsed
      if (req.headers['content-type'] !== 'application/json') {
        console.log('Warning: "content-type" header is not "application/json"');
      }
      var channel = req.params.channel;
      if (_.contains(that.channels, channel)) {
        var data = req.body;
        if (that.isValidChannelData(data)) {
          console.log(data);
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

Listener.prototype.isValidChannelData = function(data) {
  if (typeof data === 'object' && !_.isEmpty(data)) {
    return true;
  } else {
    return false;
  }
};

module.exports = Listener;