define([
  'app',
  'lib/widget_collection',
  // Widgets
  'widgets/active_users'
],

function(app, WidgetCollection, activeUsersWidget) {

  var widgets = new WidgetCollection();

  // Add the widgets you want here
  widgets.add(activeUsersWidget);

  return widgets;

});