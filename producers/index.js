var ProducerCollection = require('../lib/producer_collection');

var httpEndpoint = process.env.MB_PRODUCER_HTTPENDPOINT || 'http://localhost:3000/channels';

var producers = module.exports = new ProducerCollection({
  httpEndpoint: httpEndpoint
});

// Require the producers you want to run here
require('./active_users');
