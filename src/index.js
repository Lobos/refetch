'use strict';

import objectAssign from 'object-assign';
import ajax from './ajax';
import jsonp from './jsonp';
import { generateKey } from './util';
import { getCache, setCache } from './cache';

let peer = null;
let defaultData = {};
let defaultOptions = {};

function fetch(method, url, data={}, options={}) {
  options = objectAssign({}, defaultOptions, options);
  data = objectAssign({}, defaultData, data);
  let key = generateKey(method, url, data);
  let cache = options.cache;
  let promise;
  if (cache > 0) {
    promise = getCache(key);
    if (promise !== null) {
      return promise;
    }
  }
  if (method === 'jsonp') {
    promise = jsonp(url, data, options);
  } else {
    promise = ajax(method, url, data, options);
  }

  if (typeof peer === 'function') {
    promise = peer(promise);
  }

  if (cache > 0) {
    promise.then((res) => {
      if (!(res instanceof Error)) {
        setCache(key, res, cache);
      }
      return res;
    });
  }

  return promise;
}

function _fetch (method) {
  return (...args) => fetch(method, ...args);
}

function create (preset = {}) {
  const _ = (method) => (url, data, options) => {
    data = objectAssign({}, preset.data, data);
    options = objectAssign({}, preset.options, options)

    let promise = fetch(method, url, data, options);
    if (preset.promise) {
      promise = preset.promise(promise);
    }

    return promise;
  }

  return ['get', 'post', 'put', 'delete', 'jsonp'].reduce((obj, k) => {
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

  create,

  setPeer: function (fn) {
    console.warn('setPeer is deprecated, use create instead.')
    peer = fn;
    return this;
  },

  setDefaultData: function (obj) {
    console.warn('setDefaultData is deprecated, use create instead.')
    defaultData = objectAssign(defaultData, obj);
  },

  setDefaultOptions: function (obj) {
    console.warn('setDefaultOptions is deprecated, use create instead.')
    defaultOptions = objectAssign(defaultOptions, obj);
  }
};

