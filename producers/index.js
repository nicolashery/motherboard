var Producers = require('../lib/producers');

// Warning: make sure you set this env variable on Heroku, 
// or app will crash trying to post to localhost
var httpEndpoint = process.env.PRODUCER_HTTPENDPOINT || 'http://localhost:3000/channels';

var producers = module.exports = new Producers({
  httpEndpoint: httpEndpoint
});

// Require the producers you want to run here
producers.add(require('./registered_users'));
producers.add(require('./premium_users'));
producers.add(require('./visitors_online'));
