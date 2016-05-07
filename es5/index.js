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

function fetch(method, url) {
  var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  options = (0, _objectAssign2.default)({}, defaultOptions, options);
  data = (0, _objectAssign2.default)({}, defaultData, data);
  var key = (0, _util.generateKey)(method, url, data);
  var cache = options.cache;
  var promise = void 0;
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

function _fetch(method) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return fetch.apply(undefined, [method].concat(args));
  };
}

function create() {
  var preset = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ = function _(method) {
    return function (url, data, options) {
      data = (0, _objectAssign2.default)({}, preset.data, data);
      options = (0, _objectAssign2.default)({}, preset.options, options);

      var promise = fetch(method, url, data, options);
      if (preset.promise) {
        promise = preset.promise(promise);
      }

      return promise;
    };
  };

  return ['get', 'post', 'put', 'delete', 'jsonp'].reduce(function (obj, k) {
    obj[k] = _(k);
    return obj;
  }, {});
}

module.exports = {
  get: _fetch('get'),

  post: _fetch('post'),

  put: _fetch('put'),

  'delete': _fetch('delete'),

  jsonp: _fetch('jsonp'),

  create: create,

  setPeer: function setPeer(fn) {
    console.warn('setPeer is deprecated, use create instead.');
    peer = fn;
    return this;
  },

  setDefaultData: function setDefaultData(obj) {
    console.warn('setDefaultData is deprecated, use create instead.');
    defaultData = (0, _objectAssign2.default)(defaultData, obj);
  },

  setDefaultOptions: function setDefaultOptions(obj) {
    console.warn('setDefaultOptions is deprecated, use create instead.');
    defaultOptions = (0, _objectAssign2.default)(defaultOptions, obj);
  }
};