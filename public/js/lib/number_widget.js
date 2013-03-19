define([
  'app',
  'lib/widget',
  // jQuery plugin
  'livestamp'
],

function(app, Widget) {

  var NumberWidget = {};

  NumberWidget.Model = Widget.Model.extend({

    defaults: {
      'title': 'Untitled number widget',
      'value': 0,
      'timestamp': null
    },

    // TODO: A link to the view, probably a better way to do this
    getView: function() {
      return NumberWidget.View;
    }

  });

  NumberWidget.View = Widget.View.extend({

    template: JST.number_widget,

    initialize: function() {
      // Bind to model change events
      this.listenTo(this.model, 'change:value', this.updateValue);
      this.listenTo(this.model, 'change:timestamp', this.updateTimestamp);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      // Cache some elements
      this.$value = this.$('.js-value');
      this.$timestamp = this.$('.js-timestamp');
      return this;
    },

    updateValue: function() {
      this.$value.text(this.model.get('value'));
    },

    updateTimestamp: function() {
      // The livestamp jQuery plugin will automatically pick this up
      // and update the text of the html element
      this.$timestamp.attr('data-livestamp', this.model.get('timestamp'));
    }

  });

  return NumberWidget;

});