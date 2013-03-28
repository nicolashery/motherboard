var Producer = require('../lib/producer');

var producer = new Producer('premium_users', {

  // In milliseconds
  updateInterval: 7000,

  getInitial: function(callback) {
    var data = {value: 720}; 
    callback(null, data);
  },

  getUpdate: function(callback) {
    var data;
    // Only update 2 out of 3 times to make it seem 'irregular'
    if (Math.random() > 0.33 ) {
      // Go up most of the time, down sometimes
      if (Math.random() < 0.75) {
        data = {delta: 1};
      } else {
        data = {delta: -1};
      }
      callback(null, data);
    }
  }

});

module.exports = producer;