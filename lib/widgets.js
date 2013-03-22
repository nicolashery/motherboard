var _ = require('lodash');

// `Widgets` is a collection of widgets.
// 
// It registers widgets to a list, and merges their data channels together
// if there are any in common. It also provides the app with helper methods
// to loop through widgets or fetch a particular one.
// 
// Each widget created should be added to a widget collection used by the app
// using the `add` method.

// Constructor
function Widgets() {
  this.list = [];
}

// Add a widget to the collection
Widgets.prototype.add = function(widget) {
  this.list.push(widget);
  return this;
};

// Return the current number of widgets
Widgets.prototype.count = function() {
  return this.list.length;
};

// Get all unique channel names listened to by the widgets in the collection
Widgets.prototype.getChannels = function() {
  var channels = [];
  for(var i = 0, l = this.list.length; i < l; i++) {
    // Add widget channels, but keep only unique values
    channels = _.union(channels, this.list[i].channels);
  }
  return channels;
};

// Return a widget from the collection by name (undefined if not found)
Widgets.prototype.get = function(name) {
  return _.find(this.list, {name: name});
};

// Underscore methods that we want to implement on the collection.
var methods = ['forEach', 'each'];

// Mix in each Underscore method as a proxy to `Widgets#list`.
_.forEach(methods, function(method) {
  Widgets.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args.unshift(this.list);
    return _[method].apply(_, args);
  };
});

module.exports = Widgets;