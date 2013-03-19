define([
  'app'
],

function(app) {

  var Widgets = {};

  Widgets.Collection = Backbone.Collection.extend({
    // TODO: add method `fetchAll`
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