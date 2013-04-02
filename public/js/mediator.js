define([
  'app',
  'socketio'
],

function(app, io) {

  // Mediator for application-wide events
  var mediator = _.clone(Backbone.Events);

  // Sockets
  var socket = io.connect();

  socket.on('widget:update', function(attributes) {
    if (attributes.name) {
      mediator.trigger(attributes.name, attributes);
    }
  });

  return mediator;

});