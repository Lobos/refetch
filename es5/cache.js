'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCache = getCache;
exports.setCache = setCache;

var _pinkyswear = require('pinkyswear');

var _pinkyswear2 = _interopRequireDefault(_pinkyswear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STORAGE_KEY = '517abb684366799b';
var storage = window && window.localStorage ? window.localStorage : null;

var CACHE = {};

if (storage) {
  var item = storage.getItem(STORAGE_KEY);
  if (item) {
    try {
      CACHE = JSON.parse(item) || {};
      clean();
    } catch (e) {
      console.warn(e);
    }
  }
}

function getCache(key) {
  var data = CACHE[key];
  if (!data) {
    return null;
  }

  if (data.expire < new Date().getTime()) {
    setCache(key, null);
    return null;
  }

  var promise = (0, _pinkyswear2.default)(function (pinky) {
    pinky.send = function () {
      promise(true, [data.data]);
    };

    pinky.complete = function (f) {
      return pinky.then(f, f);
    };

    pinky['catch'] = function (f) {
      return pinky.then(null, f);
    };

    pinky.cancel = function () {};

    return pinky;
  });

  promise.send();

  return promise;
}

function setCache(key, data) {
  var expire = arguments.length <= 2 || arguments[2] === undefined ? 3600 : arguments[2];

  if (data === null) {
    delete CACHE[key];
  } else {
    expire *= 1000;
    CACHE[key] = {
      data: data,
      expire: new Date().getTime() + expire
    };
  }
  save();
}

// use single item handle expire
function save() {
  if (!storage) {
    return;
  }
  clean();
  storage.setItem(STORAGE_KEY, JSON.stringify(CACHE));
}

function clean() {
  var expire = new Date().getTime();
  Object.keys(CACHE).forEach(function (key) {
    if (expire > (CACHE[key].expire || 0)) {
      delete CACHE[key];
    }
  });
}