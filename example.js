var NumberWidget = require('./lib/number_widget')
  , WidgetCollection = require('./lib/widget_collection')
  , redisClient = require('./redis_util').createRedisClient()
  , widgets = require('./widgets');

widgets.forEach(function(widget) {
  console.log(widget);
});

myWidget = new NumberWidget('my_widget', {
  channels: ['active_users'],
  redisClient: redisClient
});

// console.log(myWidget.name);
// console.log(myWidget.redisClient);

myWidgets = new WidgetCollection();
myWidgets.add(myWidget);
console.log(widgets.getChannels());
myWidget2 = new NumberWidget('my_widget2', {
  channels: ['active_users'],
  redisClient: redisClient
});
myWidgets.add(myWidget2);
console.log(myWidgets.getChannels());

myWidget.on('update', function(attributes) {
  console.log(attributes);
});

/*
myWidget.update({
  value: 10,
  timestamp: 'some crap value'
}, function(err, attributes){
  console.log('set value ok');
  myWidget.update({
    delta: -1.5
  }, function(err, attributes){
    console.log('update value ok');
  });
});
*/

redisClient.quit();