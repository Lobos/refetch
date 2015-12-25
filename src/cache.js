'use strict';

const CACHE = {};

export function getCache(key) {
  let data = CACHE[key];
  if (!data) {
    return null;
  }

  if (data.expire.getTime() < new Date().getTime()) {
    setCache(key, null);
    return null;
  }

  return {
    then: (f) => {
      f(data.data);
    }
  };
}

export function setCache(key, data, expire=3600) {
  if (data === null) {
    delete CACHE[key];
  } else {
    expire *= 1000;
    CACHE[key] = {
      data,
      expire: new Date(new Date().getTime() + expire)
    };
  }
}
