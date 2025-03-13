"use strict";

var i18next = require('i18next');
var FsBackend = require('i18next-fs-backend');
var i18nextMiddleware = require('i18next-http-middleware');
var _require = require('path'),
  join = _require.join;
i18next.use(i18nextMiddleware.LanguageDetector).use(FsBackend).init({
  backend: {
    loadPath: join(__dirname, '../locales/json/{{lng}}.json')
  },
  lng: 'uz',
  fallbackLng: 'uz',
  preload: ['uz', 'cyrl', 'ru'],
  detection: {
    order: ['header', 'querystring', 'cookie'],
    lookupHeader: 'x-app-lang',
    ignoreCase: true,
    caches: ['cookie']
  }
}, function (err) {
  if (err) {
    return console.log('Something went wrong loading', err);
  }
});
module.exports = i18nextMiddleware.handle(i18next);