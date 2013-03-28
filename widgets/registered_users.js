var NumberWidget = require('../lib/number_widget');

var widget = new NumberWidget('registered_users', {
  channels: ['registered_users']
});

module.exports = widget;