var Producer = require('../lib/producer');

var producer = new Producer('registered_users', {

  // In milliseconds
  updateInterval: 5000,

  getInitial: function(callback) {
    var data = {value: 14220}; 
    callback(null, data);
  },

  getUpdate: function(callback) {
    var data;
    // Only update 2 out of 3 times to make it seem 'irregular'
    if (Math.random() > 0.33 ) {
      // Go up all the time!
      data = {delta: 1};
      callback(null, data);
    }
  }

});

module.exports = producer;