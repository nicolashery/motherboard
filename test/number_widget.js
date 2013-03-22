var should = require('chai').should()
  , sinon = require('sinon')
  , chai = require('chai')
  , sinonChai = require('sinon-chai')
  , moment = require('moment')
  , NumberWidget = require('../lib/number_widget');

chai.use(sinonChai);

describe('NumberWidget', function() {

  beforeEach(function() {
    // Keep state in this object
    var attributes = {
      name: 'my_widget',
      value: 700,
      timestamp: '2013-03-22T16:33:17-04:00'
    };

    // Fake Redis client
    var redisClient = {
      hget: function(key1, key2, callback) {
        if (key2 === 'value') {
          callback(null, attributes.value);
        } else if (key2 === 'timestamp') {
          callback(null, attributes.timestamp);
        }
      },

      hset: function(key1, key2, value, callback) {
        if (key2 === 'value') {
          attributes.value = value;
          callback();
        } else if (key2 === 'timestamp') {
          attributes.timestamp = value;
          callback();
        }
      },

      hincrby: function(key1, key2, value, callback) {
        if (key2 === 'value') {
          attributes.value = attributes.value + value;
          callback();
        }
      }
    };

    // Make things available to each test
    this.attributes = attributes;
    this.redisClient = redisClient;
    this.widget = new NumberWidget(attributes.name, {
      redisClient: redisClient
    });

    // Fake time
    this.clock = sinon.useFakeTimers();
    
  });

  afterEach(function() {
    this.clock.restore();
  });
  

  it('should serialize attributes from datastore', function(){
    var callback = sinon.spy();

    this.widget.serialize(callback);

    callback.should.have.been.calledWithMatch(null, this.attributes);
  });

  it('should reset value from data event', function(){
    var callback = sinon.spy();
    var data = {value: 100};

    this.widget.update(data, callback);

    this.attributes.value.should.be.equal(data.value);
  });

  it('should modify value from data event', function(){
    var callback = sinon.spy();
    var data = {delta: 1};
    var expectedValue = this.attributes.value + data.delta;

    this.widget.update(data, callback);

    this.attributes.value.should.be.equal(expectedValue);
  });

  it('should set timestamp from data event', function(){
    var callback = sinon.spy();
    var data = {value: 100, timestamp: 'some ISO 8601 value'};

    this.widget.update(data, callback);

    this.attributes.timestamp.should.be.equal(data.timestamp);
  });

  it('should reset value if given both value and delta', function(){
    var callback = sinon.spy();
    var data = {value: 100, delta: 1};

    this.widget.update(data, callback);

    this.attributes.value.should.be.equal(data.value);
  });

  it('should use current ISO 8601 timestamp if none provided', function(){
    var callback = sinon.spy();
    var data = {value: 100};
    // Using Sinon fake timers, so time is "stopped" and we can do this
    var expectedTimestamp = moment().format();

    this.widget.update(data, callback);

    this.attributes.timestamp.should.be.equal(expectedTimestamp);
  });

  it('should call given callback with attributes after update', function(){
    var callback = sinon.spy();
    var data = {value: 100};

    this.widget.update(data, callback);

    callback.should.have.been.calledWithMatch(null, this.attributes);
  });

  it('should emit event with attributes after update', function(done){
    var callback = sinon.spy();
    var data = {value: 100};
    var that = this;

    this.widget.on('update', function(attributes) {
      attributes.should.be.deep.equal(that.attributes);
      done();
    });
    this.widget.update(data, callback);
  });

});