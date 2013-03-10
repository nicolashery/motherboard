define([
  'app'
],

function(app) {

  var Widget = {};

  Widget.Model = Backbone.Model.extend({

    defaults: {
      'title': 'Untitled widget',
      'value': 0
    },

    initialize: function(attributes, options) {
      // If a channel is given, listen to updates on it
      if (options && options.channel) {
        this.listenTo(app.mediator, options.channel, this.onChannelUpdate);
      }
    },

    onChannelUpdate: function(attributes) {
      this.set(attributes);
    }

  });

  Widget.View = Backbone.View.extend({

    template: JST.widget,

    initialize: function() {
      // Bind to model change events
      this.listenTo(this.model, 'change:value', this.updateValue);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      // Cache some elements
      this.$value = this.$('.js-value');
      this.$title = this.$('.js-title');
      return this;
    },

    updateValue: function() {
      this.$value.text(this.model.get('value'));
    }

  });

  return Widget;

});