var NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('visitors_online', {
  channels: ['visitors_online']
});

module.exports = widget;