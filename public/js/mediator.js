define([
  'app',
  'socketio'
],

function(app, io) {

  // Mediator for application-wide events
  var mediator = _.clone(Backbone.Events);

  // Sockets
  var socket = io.connect();

  socket.on('widget', function(data) {
    if (data.channel) {
      mediator.trigger(data.channel, data);
    }
  });

  return mediator;

});