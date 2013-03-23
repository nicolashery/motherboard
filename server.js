var express = require('express')
  , http = require('http');

var app = module.exports.app = express();

// Configuration
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('37 monkeys'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// Need a `http.Server` for socket.io
var server = module.exports.server = http.createServer(app);

// Sockets
// Need `app` and `server` to be created before require
var sockets = module.exports.sockets = require('./sockets');

// "Glue code" for widgets
require('./init');

// Routes
require('./routes');

// Demo
app.set('demo', process.env.DEMO === 'true');
if (app.get('demo')) {
  // For demo, run only one instance of this app & run producers in this thread
  var producers = require('./producers');
  producers.runAll();
}

// Start the HTTP server
server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));