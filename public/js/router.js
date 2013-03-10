define([
  'app',
  'widget'
],

function(app, Widget) {

  var Router = Backbone.Router.extend({

    routes: {
      '': 'index'
    },

    index: function() {
      console.log('----- Router#index -----');
      var widget = app.widget = new Widget.Model({
        title: 'Registered Sites'
      }, {channel: 'registered_sites'});
      var widgetView = new Widget.View({
        el: '#main',
        model: widget
      });
      // Would need to fetch widget initial value here
      widgetView.render();
    }

  });

  return Router;

});