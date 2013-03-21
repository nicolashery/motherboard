define([
  'app',
  'lib/widgets',
  // Widgets
  'widgets/registered_users',
  'widgets/premium_users',
  'widgets/visitors_online'
],

function(app, Widgets, registeredUsers, premiumUsers, visitorsOnline) {

  var widgets = new Widgets.Collection();

  // Add the widgets you want here
  widgets.add(registeredUsers);
  widgets.add(premiumUsers);
  widgets.add(visitorsOnline);

  return widgets;

});