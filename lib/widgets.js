var _ = require('lodash');

function Widgets() {
  this.list = [];
}

Widgets.prototype.add = function(widget) {
  this.list.push(widget);
};

Widgets.prototype.getChannels = function() {
  var channels = [];
  for(var i = 0, l = this.list.length; i < l; i++) {
    // Add widget channels, but keep only unique values
    channels = _.union(channels, this.list[i].channels);
  }
  return channels;
};

// Underscore methods that we want to implement on the collection.
var methods = ['forEach'];

// Mix in each Underscore method as a proxy to `Widgets#list`.
_.forEach(methods, function(method) {
  Widgets.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args.unshift(this.list);
    return _[method].apply(_, args);
  };
});

module.exports = Widgets;