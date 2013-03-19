define([
  'app',
  'widgets/index'
],

function(app, widgets) {

  var Router = Backbone.Router.extend({

    initialize: function() {
      app.widgets = widgets;
    },

    routes: {
      '': 'index'
    },

    index: function() {
      console.log('----- Router#index -----');
      // TODO: render the collection instead
      var widget = widgets.get('active_users');
      var widgetView = new (widget.getView())({
        el: '#main',
        model: widget
      });
      // Would need to fetch widget initial value here
      widgetView.render();
    }

  });

  return Router;

});