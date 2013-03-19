var _ = require('lodash');

function ProducerCollection(options) {
  this.list = [];
  if (!options) options = {};
  if (options.httpEndpoint) this.httpEndpoint = options.httpEndpoint;
}

ProducerCollection.prototype.add = function(producer) {
  this.list.push(producer);
};

ProducerCollection.prototype.runAll = function() {
  this.forEach(function(producer) {
    producer.run();
  });
  return this;
};

// Underscore methods that we want to implement on the Collection.
var methods = ['forEach'];

// Mix in each Underscore method as a proxy to `ProducerCollection#list`.
_.forEach(methods, function(method) {
  ProducerCollection.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args.unshift(this.list);
    return _[method].apply(_, args);
  };
});

module.exports = ProducerCollection;