define([
  'app',
  'lib/number_widget'
],

function(app, NumberWidget) {

  var widget = new NumberWidget.Model({
    name: 'premium_users',
    title: 'Premium Users'
  });

  return widget;

});