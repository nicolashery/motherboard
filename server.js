var express = require('express')
  , http = require('http')
  , _ = require('lodash')
  , createRedisClient = require('./redis_util').createRedisClient
  , Listener = require('./lib/listener')
  , Publisher = require('./lib/publisher');

var app = module.exports.app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('37 monkeys'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.set('demo', process.env.DEMO === 'true');

// ROUTES
app.get('/', function(req, res) {
  res.render('index');
});

// Need a `http.Server` for socket.io
var server = module.exports.server = http.createServer(app);

// Sockets
// Need `app` and `server` to be created before require
var sockets = require('./sockets');

// Glue code
var widgets = require('./widgets');
// Give widgets a redis client to persist state
var redisClient = createRedisClient();
widgets.forEach(function(widget) {
  widget.setRedisClient(redisClient);
});
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
    console.log('widget ' + widget.name + ' listening on channel ' + channel);
  });
});
// When widgets update, publish the new widget values
var publisher = new Publisher({
  sockets: sockets,
  redisClient: redisClient,
  redisClientSubscriber: createRedisClient()
});
widgets.forEach(function(widget) {
  widget.on('update', _.bind(publisher.publish, publisher));
});

// DEMO
if (app.get('demo')) {
  // For demo, run only one instance of this app & run producers in this thread
  var producers = require('./producers');
  producers.runAll();
}

// Start the HTTP server
server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));