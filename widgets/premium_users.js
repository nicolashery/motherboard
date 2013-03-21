var widgets = module.parent.exports
  , NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('premium_users', {
  channels: ['premium_users']
});

widgets.add(widget);

module.exports = widget;