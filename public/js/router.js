define([
  'app',
  'lib/widgets',
  'widgets/index'
],

function(app, Widgets, widgets) {

  var Router = Backbone.Router.extend({

    initialize: function() {
      app.widgets = widgets;
    },

    routes: {
      '': 'index'
    },

    index: function() {
      // console.log('----- Router#index -----');
      // Get widget initial values
      widgets.fetchAll();
      // Add widget list view to DOM
      var widgetsView = new Widgets.View({collection: widgets});
      $('#main').append(widgetsView.render().el);
      widgetsView.addAll();
    }

  });

  return Router;

});