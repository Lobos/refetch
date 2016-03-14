'use strict';

var _qwest = require('./qwest');

var _qwest2 = _interopRequireDefault(_qwest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ajax(mothed, url, data, options) {
  return _qwest2.default[mothed](url, data, options);
};