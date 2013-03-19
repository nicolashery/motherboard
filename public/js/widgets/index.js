define([
  'app',
  'lib/widgets',
  // Widgets
  'widgets/active_users'
],

function(app, Widgets, activeUsersWidget) {

  var widgets = new Widgets.Collection();

  // Add the widgets you want here
  widgets.add(activeUsersWidget);

  return widgets;

});