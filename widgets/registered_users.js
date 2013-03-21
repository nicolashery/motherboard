var widgets = module.parent.exports
  , NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('registered_users', {
  channels: ['registered_users']
});

widgets.add(widget);

module.exports = widget;