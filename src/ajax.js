'use strict';

import qwest from './qwest';

module.exports = function ajax (mothed, url, data, options) {
  let parseJson = false;
  options = options || {};
  if (options.responseType === 'json') {
    parseJson = true;
    options.responseType = 'text';
  }
  return qwest[mothed](url, data, options).then((xhr, res) => {
    if (parseJson) {
      return JSON.parse(res);
    } else {
      return res;
    }
  });
};
