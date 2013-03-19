var _ = require('lodash');

function Producers(options) {
  this.list = [];
  if (!options) options = {};
  if (options.httpEndpoint) this.httpEndpoint = options.httpEndpoint;
}

Producers.prototype.add = function(producer) {
  this.list.push(producer);
};

Producers.prototype.runAll = function() {
  this.forEach(function(producer) {
    producer.run();
  });
  return this;
};

// Underscore methods that we want to implement on the collection.
var methods = ['forEach'];

// Mix in each Underscore method as a proxy to `Producers#list`.
_.forEach(methods, function(method) {
  Producers.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args.unshift(this.list);
    return _[method].apply(_, args);
  };
});

module.exports = Producers;