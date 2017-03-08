"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

/**
 * Check if versioning enabled
 *
 * @returns {boolean}
 */
exports.default = function () {
  return Elixir.inProduction && (0, _lodash.get)(Elixir.config, 'versioning.enabled', false);
};