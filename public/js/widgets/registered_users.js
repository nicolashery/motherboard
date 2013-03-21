define([
  'app',
  'lib/number_widget'
],

function(app, NumberWidget) {

  var widget = new NumberWidget.Model({
    name: 'registered_users',
    title: 'Registered Users'
  });

  return widget;

});