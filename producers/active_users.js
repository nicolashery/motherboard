var producers = module.parent.exports
  , Producer = require('../lib/producer');

// Get `httpEndpoint` from parent collection
var httpEndpoint = producers.httpEndpoint;

var producer = new Producer('active_users', {
  httpEndpoint: httpEndpoint,
  getUpdate: function(callback) {
    var data;
    // Only update 2 out of 3 times
    if (Math.random() > 0.33 ) {
      // Go up half the time, down the other half
      if (Math.random() < 0.5) {
        data = {delta: 1};
      } else {
        data = {delta: -1};
      }
      callback(null, data);
    }
  }
});

producers.add(producer);

module.exports = producer;