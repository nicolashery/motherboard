var app = module.parent.exports.app
  , server = module.parent.exports.server
  , sio = require('socket.io');

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

module.exports = io.sockets;