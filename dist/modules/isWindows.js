"use strict";

/**
 * Detect Windows OS
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return (/^win/.test(process.platform)
  );
};