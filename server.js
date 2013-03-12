var express = require('express')
  , http = require('http')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , sio = require('socket.io')
  , redis = require('redis');

var app = express();
// Need a `http.Server` for socket.io
var server = http.createServer(app);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('37 monkeys'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

// Producer
function Producer(channel) {
  this.channel = channel;
}

util.inherits(Producer, EventEmitter);

Producer.prototype.run = function() {
  // Fake the creation of events
  setInterval(_.bind(this.createEvent, this), 5000);
  console.log('Started producer on channel ' + this.channel);
};

Producer.prototype.createEvent = function() {
  // Only create event 2 out of 3 times
  if (Math.random() > 0.33 ) {
    // Go up half the time, down the other half
    if (Math.random() < 0.5) {
      this.emit(this.channel, {change: 1});
      // console.log('Producer ' + this.channel + ' 1');
    } else {
      this.emit(this.channel, {change: -1});
      // console.log('Producer ' + this.channel + ' -1');
    }
  }
};

// Tracker
function Tracker(channel, redisClient, redisPubSubClient) {
  this.channel = channel;
  this.redisClient = redisClient;
  // emit event as updates come through redis pub/sub
  // TODO: decide if this is the best place, as we need a dedicated pubsub client
  var that = this;
  if (redisPubSubClient) {
    redisPubSubClient.on('message', function(channel, message) {
      console.log('redis message ' + channel + ' ' + message);
      that.emit(channel, message);
    });
    redisPubSubClient.subscribe(this.channel);
  }
}

util.inherits(Tracker, EventEmitter);

Tracker.prototype.sync = function() {
  // Fake sync with database
  var value = 900;
  console.log('syncing ' + this.channel);
  this.setValue(value);
};

// Process an "event" that happened on the channel
Tracker.prototype.onEvent = function(data) {
  // Setting a new "value" wins over "change"
  if (data.value) {
    this.setValue(data.value);
  } 
  else if (data.change) {
    this.updateValue(data.change);
  }
  // Else do nothing
};

Tracker.prototype.setValue = function(value) {
  var that = this;
  if (this.redisClient) {
    this.redisClient.set(channel, value, function(err, res) {
      if (err) throw err;
      // Carefull, `res` is "OK" when setting a value
      console.log('set redis store ' + that.channel + ' ' + value);
      // emit through redis store, tracker will pick it up and emit through itself
      that.redisClient.publish(that.channel, value);
    });
  } else {
    // Memory store
    this.value = value;
    console.log('set memory store ' + this.channel + ' ' + this.value);
    that.emit(that.channel, this.value);
  }
};

Tracker.prototype.updateValue = function(change) {
  var that = this;
  if (this.redisClient) {
    this.redisClient.incrby(channel, change, function(err, res) {
      if (err) throw err;
      console.log('updated redis store ' + that.channel + ' ' + res);
      // emit through redis store, tracker will pick it up and emit through itself
      that.redisClient.publish(that.channel, res);
    });
  } else {
    // Memory store
    this.value = this.value + change;
    console.log('updated memory store ' + this.channel + ' ' + this.value);
    that.emit(that.channel, this.value);
  }
};

// Check if we can process the event data (return true or false)
Tracker.prototype.isValidEventData = function(data) {
  if ((data.change && parseFloat(data.change)) || 
      (data.value && parseFloat(data.value))) {
    return true;
  } else {
    return false;
  }
};

// Publisher
function Publisher(channel, sockets) {
  this.channel = channel;
  this.sockets = sockets;
}

Publisher.prototype.onUpdate = function(data) {
  if (this.sockets) {
    this.sockets.emit('widget', {
      channel: this.channel,
      value: data
    });
  }
};

// Sockets
var io = sio.listen(server, {'log level': 2});

io.sockets.on('connection', function(socket) {
  console.log('socket.io connected');
});

// Heroku doesn't support WebSockets (yet!), force long polling in production
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
if (app.get('env') === 'production') {
  io.configure(function () { 
    io.set('transports', ['xhr-polling']); 
    io.set('polling duration', 10); 
  });
}

// Redis
if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  var client = exports.client  = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
  var client = exports.client  = redis.createClient();
}

client.on("error", function (err) {
  console.log("Error " + err);
});

// dedicated pub/sub client for the tracker
if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  var pubSubClient = redis.createClient(rtg.port, rtg.hostname);
  pubSubClient.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
  var pubSubClient = redis.createClient();
}

// try some redis stuff
// client.set('registered_sites', 900, redis.print);
// client.incrby('registered_sites', 3, redis.print);
// client.incrby('registered_sites', -2, redis.print);

// Widget
var channel = 'registered_sites';
producer = new Producer(channel);
tracker = new Tracker(channel, client, pubSubClient);
publisher = new Publisher(channel, io.sockets);
producer.on(channel, _.bind(tracker.onEvent, tracker));
tracker.on(channel, _.bind(publisher.onUpdate, publisher));

// Listener API
app.post('/widgets/:channel', function(req, res) {
  // Note: client sending HTTP request better have
  // Content-Type: application/json
  // or else body won't get parsed
  if (req.params.channel === 'registered_sites') {
    console.log(req.body);
    // Shouldn't be using `tracker` in here... a `listener`?
    if (tracker.isValidEventData(req.body)) {
      tracker.onEvent(req.body);
      res.send(200);
    } else {
      res.send(400);
    }
  } else {
    res.send(404);
  }
});

producer.run();
// Race condition here...
tracker.sync();

server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));