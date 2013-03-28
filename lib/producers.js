var _ = require('lodash');

function Producers(options) {
  this.list = [];
  if (!options) options = {};
  if (options.httpEndpoint) this.httpEndpoint = options.httpEndpoint;
}

Producers.prototype.add = function(producer, options) {
  // When producers are added to a collection, we give them the collection's
  // http endpoint unless specified otherwise
  var keepHttpEndpoint = false;
  if (options && options.keepHttpEndpoint) {
    keepHttpEndpoint = options.keepHttpEndpoint;
  }
  if (this.httpEndpoint && !keepHttpEndpoint) {
    producer.httpEndpoint = this.httpEndpoint;
  }
  // Add producer to collection
  this.list.push(producer);
  return this;
};

Producers.prototype.runAll = function() {
  this.forEach(function(producer) {
    producer.run();
  });
  return this;
};

// Underscore methods that we want to implement on the collection.
var methods = ['forEach', 'each'];

// Mix in each Underscore method as a proxy to `Producers#list`.
_.forEach(methods, function(method) {
  Producers.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args.unshift(this.list);
    return _[method].apply(_, args);
  };
});

module.exports = Producers;