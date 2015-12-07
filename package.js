Package.describe({
  name: 'dispatch:fast-track',
  version: '0.0.5',
  summary: 'Easily track everything that happens to an entity, over time and across various servers and apps',
  git: 'https://github.com/DispatchMe/meteor-fast-track'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2');

  api.use([
    // core
    'underscore',
    'mongo',
    'ecmascript',
  ]);

  api.use([
    'templating'
  ], 'client');

  api.addFiles([
    'server/fast-track.js'
  ], 'server');

  api.addFiles([
    'client/fast-track.js',
    'client/templates/report/report.html',
    'client/templates/report/report.js',
  ], 'client');

  api.export('FastTrack');
});
