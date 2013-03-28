define([
  'backbone',
  'templates'
],

function(Backbone) {
  
  // Provide a global location to place configuration settings and module
  // creation
  var app = {};

  // For debugging, attach to window
  window.app = app;

  return app;

});