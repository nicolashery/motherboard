define([
  'app'
],

function(app) {

  var Widgets = {};

  Widgets.Collection = Backbone.Collection.extend({

    // Unlike Backbone's Collection#fetch, this method goes through
    // the collection and calls each model's `fetch` method
    // (Because our widgets collection is already populated 
    //  on the client-side)
    fetchAll: function() {
      this.each(function(widget) {
        widget.fetch();
      });
    }

  });

  Widgets.View = Backbone.View.extend({

    template: JST.widgets,

    render: function() {
      this.$el.html(this.template());
      // Cache the list element
      this.$list = this.$('.js-widget-list');
      return this;
    },

    addOne: function(widget) {
      // Each type of widget has its own view, so ask the widget for it
      var view = new (widget.getView())({model: widget});
      this.$list.append(view.render().el);
    },

    addAll: function() {
      this.collection.each(this.addOne, this);
    }

  });

  return Widgets;

});