var should = require('chai').should()
  , Widget = require('../lib/widget');

describe('Widget', function() {

  it('should have a name when created', function(){
    var widget = new Widget('my_widget');
    widget.should.have.property('name').equal('my_widget');
  });

  it('should have channels when created', function() {
    var widget = new Widget('my_widget', {channels: ['data_channel']});
    widget.should.have.property('channels').deep.equal(['data_channel']);
  });

  it('should have a serialize method', function() {
    var widget = new Widget('my_widget');
    widget.serialize.should.be.a('function');
  });

  it('should have an update method', function() {
    var widget = new Widget('my_widget');
    widget.update.should.be.a('function');
  });

  it('should set Redis client after creation', function() {
    var widget = new Widget('my_widget');
    var redisClient = {};

    widget.setRedisClient(redisClient);
    
    widget.redisClient.should.be.equal(redisClient);
  });

  it('should have EventEmitter functions', function() {
    var widget = new Widget('my_widget');
    widget.on.should.be.a('function');
    widget.emit.should.be.a('function');
  });

});