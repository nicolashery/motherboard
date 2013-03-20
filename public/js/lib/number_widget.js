define([
  'app',
  'lib/widget',
  'numeral',
  // jQuery plugin
  'livestamp'
],

function(app, Widget, numeral) {

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
      var data = this.model.toJSON();
      data.value = this.getFormattedValue();
      this.$el.html(this.template(data));
      // Cache some elements
      this.$value = this.$('.js-value');
      this.$timestamp = this.$('.js-timestamp');
      // TODO: we're rendering the value twice just to set the correct font size
      // move to handlebars helper?
      this.updateValue();
      return this;
    },

    getFormattedValue: function() {
      var value = this.model.get('value');
      value = numeral(value).format('0,0');
      return value;
    },

    updateValue: function() {
      this.$value.text(''); // Empty text to avoid seeing resize
      this.resetValueClasses();
      this.setValueClass(this.model.get('value'));
      this.$value.text(this.getFormattedValue());
    },

    updateTimestamp: function() {
      // The livestamp jQuery plugin will automatically pick this up
      // and update the text of the html element
      // Hack: substract a few seconds because if server and client clocks
      // are not ticking at the same time, livestamp might show
      // 'in a few seconds' :-/
      var timestamp = moment(this.model.get('timestamp'))
        .subtract('seconds', 1)
        .format();
      this.$timestamp.attr('data-livestamp', timestamp);
    },

    resetValueClasses: function() {
      this.$value.removeClass('widget-value-kilo widget-value-mega');
      return this;
    },

    setValueClass: function(value) {
      if (value >= 1e6) {
        // Millions
        this.$value.addClass('widget-value-mega');
      } else if (value >= 1e3) {
        // Thousands
        this.$value.addClass('widget-value-kilo');
      }
      return this;
    }

  });

  return NumberWidget;

});