'use strict';

var _pinkyswear = require('pinkyswear');

var _pinkyswear2 = _interopRequireDefault(_pinkyswear);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var count = 0;

module.exports = function (url, data) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var promise = (0, _pinkyswear2.default)(function (pinky) {
    var id = options.name || '__cb' + (new Date().getTime().toString() + count++).substr(-10);
    var timeout = typeof options.timeout === 'number' ? options.timeout : 60000;
    var script = void 0;
    var timer = void 0;

    function cleanup() {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window[id] = function () {};
      if (timer) {
        clearTimeout(timer);
      }
    }

    pinky.send = function () {
      if (timeout) {
        timer = setTimeout(function () {
          cleanup();
          promise(false, [new Error('timeout')]);
        }, timeout);
      }

      window[id] = function (res) {
        cleanup();
        promise(true, [res]);
      };

      // add qs component
      var callback = options.callback || 'callback';
      data = data || {};
      data[callback] = id;
      url = (0, _util.solveUrl)(url, data);

      // create script
      script = document.createElement('script');
      script.src = url;
      document.head.appendChild(script);
    };

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

  if (options.delay > 0) {
    setTimeout(function () {
      promise.send();
    }, options.delay);
  } else {
    promise.send();
  }

  return promise;
};