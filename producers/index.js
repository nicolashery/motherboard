var ProducerCollection = require('../lib/producer_collection');

// Warning: make sure you set this env variable on Heroku, 
// or app will crash trying to post to localhost
var httpEndpoint = process.env.PRODUCER_HTTPENDPOINT || 'http://localhost:3000/channels';

var producers = module.exports = new ProducerCollection({
  httpEndpoint: httpEndpoint
});

// Require the producers you want to run here
require('./active_users');
