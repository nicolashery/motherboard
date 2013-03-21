var producers = module.parent.exports
  , Producer = require('../lib/producer');

var producer = new Producer('visitors_online', {
  
  // Get `httpEndpoint` from parent collection
  httpEndpoint: producers.httpEndpoint,

  // In milliseconds
  updateInterval: 1000,

  getInitial: function(callback) {
    var data = {value: 1457932}; 
    callback(null, data);
  },

  getUpdate: function(callback) {
    var data;
    // Only update 2 out of 3 times to make it seem 'irregular'
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