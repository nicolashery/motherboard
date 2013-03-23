var app = module.parent.exports.app
  , sockets = module.parent.exports.sockets
  , _ = require('lodash')
  , createRedisClient = require('./redis_util').createRedisClient
  , Listener = require('./lib/listener')
  , Publisher = require('./lib/publisher')
  , debug = require('debug')('motherboard:init');

// "Glue code" to initialize the app:
// - import all widgets
// - set up datastore to persist widget state
// - listen on channels for data events
// - trigger publish on widget updates

var widgets = require('./widgets');

// STATE
// Give widgets a redis client to persist state
var redisClient = createRedisClient();
widgets.forEach(function(widget) {
  widget.setRedisClient(redisClient);
});

// LISTENING
// Listen for data events on the channels the widgets need
var channels = widgets.getChannels();
var listener = new Listener({
  channels: channels,
  app: app
});
// When data events happen, have the widgets update
widgets.forEach(function(widget) {
  _.forEach(widget.channels, function(channel) {
    listener.on(channel, _.bind(widget.update, widget));
    debug('widget %s listening on channel %s', widget.name, channel);
  });
});

// PUBLISHING
// When widgets update, publish the new widget values
var publisher = new Publisher({
  sockets: sockets,
  redisClient: redisClient,
  redisClientSubscriber: createRedisClient()
});
widgets.forEach(function(widget) {
  widget.on('update', _.bind(publisher.publish, publisher));
});

// Make widgets available to other parts of the app
app.set('widgets', widgets);