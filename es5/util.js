'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveUrl = solveUrl;
exports.generateKey = generateKey;

var _blueimpMd = require('blueimp-md5');

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

var _jqueryParam = require('jquery-param');

var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function solveUrl(url, data) {
  var queryString = (0, _jqueryParam2.default)(data);
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + queryString;
}

function generateKey(method, url, data) {
  data = data || {};

  // sort by key
  var sorted = Object.keys(data).sort().map(function (key) {
    return key + '=' + data[key];
  });
  sorted = sorted.join('&');
  var key = method + ':' + url + ':' + sorted;

  // short key length
  if (key.length > 32) {
    key = (0, _blueimpMd2.default)(key);
  }
  return key;
}