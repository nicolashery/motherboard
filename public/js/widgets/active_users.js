define([
  'app',
  'lib/number_widget'
],

function(app, NumberWidget) {

  var widget = new NumberWidget.Model({
    name: 'active_users',
    title: 'Active Users'
  });

  return widget;

});