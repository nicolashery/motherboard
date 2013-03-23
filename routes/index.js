var app = module.parent.exports.app;

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/mockup', function(req, res) {
  res.render('mockup');
});

module.exports.app = app;
require('./api');