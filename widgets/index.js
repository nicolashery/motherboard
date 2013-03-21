var Widgets = require('../lib/widgets');

var widgets = module.exports = new Widgets();

// Require the widgets you want to run here
require('./registered_users');
require('./premium_users');
require('./visitors_online');
