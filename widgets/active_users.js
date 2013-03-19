var widgets = module.parent.exports
  , NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('active_users', {
  channels: ['active_users']
});

widgets.add(widget);

module.exports = widget;