'use strict';

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _ajax = require('./ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _jsonp = require('./jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

var _util = require('./util');

var _cache = require('./cache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var peer = null;
var defaultData = {};
var defaultOptions = {};

function fetch(method, url, data, options) {
  options = (0, _objectAssign2.default)({}, defaultOptions, options || {});
  data = (0, _objectAssign2.default)({}, defaultData, data || {});
  var key = (0, _util.generateKey)(method, url, data);
  var cache = options.cache;
  var promise = undefined;
  if (cache > 0) {
    promise = (0, _cache.getCache)(key);
    if (promise !== null) {
      return promise;
    }
  }
  if (method === 'jsonp') {
    promise = (0, _jsonp2.default)(url, data, options);
  } else {
    promise = (0, _ajax2.default)(method, url, data, options);
  }

  if (typeof peer === 'function') {
    promise = peer(promise);
  }

  if (cache > 0) {
    promise.then(function (res) {
      if (!(res instanceof Error)) {
        (0, _cache.setCache)(key, res, cache);
      }
      return res;
    });
  }

  return promise;
}

module.exports = {
  get: function get(url, data, options) {
    return fetch('get', url, data, options);
  },

  post: function post(url, data, options) {
    return fetch('post', url, data, options);
  },

  put: function put(url, data, options) {
    return fetch('put', url, data, options);
  },

  'delete': function _delete(url, data, options) {
    return fetch('delete', url, data, options);
  },

  jsonp: function jsonp(url, data, options) {
    return fetch('jsonp', url, data, options);
  },

  setPeer: function setPeer(fn) {
    peer = fn;
    return this;
  },

  setDefaultData: function setDefaultData(obj) {
    defaultData = (0, _objectAssign2.default)(defaultData, obj);
  },

  setDefaultOptions: function setDefaultOptions(obj) {
    defaultOptions = (0, _objectAssign2.default)(defaultOptions, obj);
  }
};