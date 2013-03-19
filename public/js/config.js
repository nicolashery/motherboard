// Set the require.js configuration for the application
require.config({

  // Initialize the application with the main application file
  deps: ['main'],

  paths: {
    jquery: '../components/jquery/jquery',
    // User the underscore build of lodash to minimize incompatibilities
    lodash: '../components/lodash/dist/lodash.underscore',
    backbone: '../components/backbone/backbone',
    handlebars: '../components/handlebars/handlebars',
    socketio: '../components/socket.io/dist/socket.io',
    moment: '../components/moment/moment',
    livestamp: '../components/livestampjs/livestamp',
    templates: '../templates'
  },

  map: {
    // Ensure lodash is used instead of underscore
    '*': {'underscore': 'lodash'}
  },

  shim: {
    // Backbone depends on lodash and jQuery
    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    socketio: {
      exports: 'io'
    },

    livestamp: {
      deps: ['jquery', 'moment']
    },

    templates: {
      deps: ['handlebars'],
      exports: 'Handlebars'
    }
  }

});