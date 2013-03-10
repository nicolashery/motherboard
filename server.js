var express = require('express')
  , http = require('http')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , sio = require('socket.io');

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
  setInterval(_.bind(this.createEvent, this), 2000);
  console.log('Started producer on channel ' + this.channel);
};

Producer.prototype.createEvent = function() {
  // Only create event 2 out of 3 times
  if (Math.random() > 0.33 ) {
    // Go up half the time, down the other half
    if (Math.random() < 0.5) {
      this.emit(this.channel, 1);
      // console.log('Producer ' + this.channel + ' 1');
    } else {
      this.emit(this.channel, -1);
      // console.log('Producer ' + this.channel + ' -1');
    }
  }
};

// Tracker
function Tracker(channel) {
  this.channel = channel;
}

util.inherits(Tracker, EventEmitter);

Tracker.prototype.sync = function() {
  // Fake sync with database
  this.value = 900;
};

Tracker.prototype.onEvent = function(valueUpdate) {
  // Update value with whatever happened on the channel
  this.value = this.value + valueUpdate;
  this.emit(this.channel, this.value);
  // console.log('Tracker ' + this.channel + ' ' + this.value);
};

// Publisher
function Publisher(channel) {
  this.channel = channel;
}

util.inherits(Publisher, EventEmitter);

Publisher.prototype.onUpdate = function(value) {
  io.sockets.emit('widget', {
    channel: this.channel,
    value: value
  });
  this.emit(this.channel, value);
  // console.log('Publisher ' + this.channel + ' ' + value);
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

// Widget
var channel = 'registered_sites';
producer = new Producer(channel);
tracker = new Tracker(channel);
publisher = new Publisher(channel);
producer.on(channel, _.bind(tracker.onEvent, tracker));
tracker.on(channel, _.bind(publisher.onUpdate, publisher));

producer.run();
// Race condition here...
tracker.sync();

server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));