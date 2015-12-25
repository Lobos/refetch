'use strict';

import pinkySwear from 'pinkyswear';
import { solveUrl } from './util';

let count = 0;

module.exports = function (url, data, opts = {}) {
  let promise = pinkySwear(function (pinky) {
    let id = opts.name || '__cb' + (new Date().getTime().toString() + (count++)).substr(-10);
    let timeout = typeof opts.timeout === 'number' ? opts.timeout : 60000;
    let script;
    let timer;

    function cleanup() {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window[id] = function () {};
      if (timer) {
        clearTimeout(timer);
      }
    }

    pinky.send = () => {
      if (timeout) {
        timer = setTimeout(function() {
          cleanup();
          promise(false, [new Error('timeout')]);
        }, timeout);
      }

      window[id] = function(res) {
        cleanup();
        promise(true, [res]);
      };

      // add qs component
      let callback = opts.callback || 'callback';
      data = data || {};
      data[callback] = id;
      url = solveUrl(url, data);

      // create script
      script = document.createElement('script');
      script.src = url;
      document.head.appendChild(script);
    }
   
    pinky['catch'] = function (f) {
      return pinky.then(null, f);
    };

    pinky['complete'] = function (f) {
      return pinky.then(f, f);
    };

    pinky.cancel = function () {
      if (window[id]) {
        cleanup();
      }
    };

    return pinky;

  });

  promise.send();
  return promise;
};
