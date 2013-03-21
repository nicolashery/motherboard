define([
  'app',
  'lib/number_widget'
],

function(app, NumberWidget) {

  var widget = new NumberWidget.Model({
    name: 'visitors_online',
    title: 'Visitors Online'
  });

  return widget;

});