var should = require('chai').should()
  , Widget = require('../lib/widget')
  , Widgets = require('../lib/widgets');

describe('Widgets', function() {

  it('should have a method to add widgets', function() {
    var widgets = new Widgets();
    widgets.add.should.be.a('function');
  });

  it('should return the number of widgets', function() {
    var widgets = new Widgets();
    var widget = new Widget('my_widget');

    widgets.add(widget);

    widgets.count().should.be.equal(1);
  });

  it('should return all widget channels', function() {
    var widgets = new Widgets();
    var widget1 = new Widget('widget1', {channels: ['channel1']});
    var widget2 = new Widget('widget2', {channels: ['channel2']});

    widgets.add(widget1);
    widgets.add(widget2);

    widgets.getChannels().should.include('channel1');
    widgets.getChannels().should.include('channel2');
  });

  it('should not return duplicate channels', function() {
    var widgets = new Widgets();
    var widget1 = new Widget('widget1', {channels: ['channel1']});
    var widget2 = new Widget('widget2', {channels: ['channel1']});

    widgets.add(widget1);
    widgets.add(widget2);

    widgets.getChannels().should.have.length(1);
  });

  it('should get a widget by name', function() {
    var widgets = new Widgets();
    var widget = new Widget('my_widget');

    widgets.add(widget);

    widgets.get('my_widget').should.be.equal(widget);
  });

  it('should return nothing if widget name not found', function() {
    var widgets = new Widgets();
    var widget = new Widget('my_widget');

    widgets.add(widget);

    should.not.exist(widgets.get('bad_name'));
  });

  it('should have an each method', function() {
    var widgets = new Widgets();
    widgets.forEach.should.be.a('function');
    widgets.each.should.be.a('function');
  });

});