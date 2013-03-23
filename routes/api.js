var app = module.parent.exports.app;

// Used by client-side to get initial values of widgets

app.get('/widgets', function(req, res) {
  var widgets = app.get('widgets');
  var widgetCount = widgets.count();
  var data = [];
  function onWidgetSerialized(err, attributes) {
    if(err) throw err;
    data.push(attributes);
    if (data.length === widgetCount) {
      res.send(data);
    }
  }
  widgets.forEach(function(widget) {
    widget.serialize(onWidgetSerialized);
  });
});

app.get('/widgets/:name', function(req, res) {
  var widgets = app.get('widgets');
  var widget = widgets.get(req.params.name);
  if (widget) {
    widget.serialize(function(err, attributes) {
      if (err) throw err;
      res.send(attributes);
    });
  } else {
    res.send(404, {error: 'Unknown widget'});
  }
});