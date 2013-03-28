var Widgets = require('../lib/widgets');

var widgets = module.exports = new Widgets();

// Require the widgets you want to run here
widgets.add(require('./registered_users'));
widgets.add(require('./premium_users'));
widgets.add(require('./visitors_online'));
