define([
  'app',
  'mediator'
],

function(app, mediator) {

  var Widget = {};

  Widget.Model = Backbone.Model.extend({

    idAttribute: 'name',

    urlRoot: '/widgets',

    defaults: {
      'title': 'Untitled widget'
    },

    initialize: function(attributes) {
      // If a name is given, listen to updates for it
      if (attributes && attributes.name) {
        this.listenTo(mediator, attributes.name, this.onWidgetUpdate);
      }
    },

    onWidgetUpdate: function(attributes) {
      this.set(attributes);
    },

    // TODO: A link to the view, probably a better way to do this
    View: function() {
      return Widget.View;
    }

  });

  Widget.View = Backbone.View.extend({

    tagName: 'li',

    template: JST.widget,

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

  return Widget;

});