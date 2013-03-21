var widgets = module.parent.exports
  , NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('visitors_online', {
  channels: ['visitors_online']
});

widgets.add(widget);

module.exports = widget;