"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Append relative path to entry points
 *
 * @param {string|array|object} src
 * @returns {string|array|object}
 */
exports.default = function (src) {
    var prependPath = function prependPath(file) {
        return './' + file;
    };

    if (_lodash2.default.isPlainObject(src)) {
        return _lodash2.default.mapValues(src, function (script) {
            return prependPath(script);
        });
    }

    if (_lodash2.default.isString(src)) {
        var obj = {};

        obj[_path2.default.basename(src, '.js')] = prependPath(src);

        return obj;
    }

    if (_lodash2.default.isArray(src)) {
        return _lodash2.default.map(src, function (file) {
            return prependPath(file);
        });
    }
};