Package.describe({
  summary: "forms made easy with JSON Schema"
});

Package.on_use(function (api) {
  api.use('underscore', 'client');
  api.use('handlebars', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('jquery', 'client');
  api.use('alpaca', 'client');
  api.add_files('client.html', 'client');
  api.add_files('client.js', 'client');
});
