import pinkySwear from 'pinkyswear';

const STORAGE_KEY = '517abb684366799b';
const storage = window && window.localStorage ? window.localStorage : null;

let CACHE = {};
let STORAGE_ITEMS = {}

if (storage) {
  let item = storage.getItem(STORAGE_KEY);
  if (item) {
    try {
      CACHE = JSON.parse(item) || {};
      Object.keys(CACHE).map(k => {
        STORAGE_ITEMS[k] = CACHE[k]
      });
      clean();
    } catch (e) {
      console.warn(e);
    }
  }
}

export function getCache(key) {
  let data = CACHE[key];
  if (!data) {
    return null;
  }

  if (data.expire < new Date().getTime()) {
    setCache(key, null);
    return null;
  }

  let promise = pinkySwear((pinky) => {
    pinky.send = () => {
      promise(true, [data.data]);
    };

    pinky.complete = (f) => {
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

export function setCache(key, data, expire=3600, useStorage) {
  if (data === null) {
    delete CACHE[key];
    delete STORAGE_ITEMS[key];
  } else {
    expire *= 1000;
    CACHE[key] = {
      data,
      expire: new Date().getTime() + expire
    };
    STORAGE_ITEMS[key] = CACHE[key]
  }
  if (useStorage) {
    save();
  }
}

// use single item handle expire
function save() {
  if (!storage) {
    return;
  }
  clean();
  storage.setItem(STORAGE_KEY, JSON.stringify(STORAGE_ITEMS));
}

function clean() {
  let expire = new Date().getTime();
  Object.keys(STORAGE_ITEMS).forEach((key) => {
    if (expire > (STORAGE_ITEMS[key].expire || 0)) {
      delete STORAGE_ITEMS[key];
    }
  });
}

