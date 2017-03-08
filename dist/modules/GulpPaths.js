"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _IsVersioning = require('./IsVersioning');

var _IsVersioning2 = _interopRequireDefault(_IsVersioning);

var _VersionPath = require('./VersionPath');

var _VersionPath2 = _interopRequireDefault(_VersionPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prep the Gulp src and output paths.
 *
 * @param {string|array} src
 * @param {string|null}  baseDir
 * @param {string|null}  output
 */
exports.default = function (src, baseDir, output) {
    baseDir = baseDir || Elixir.config.get('assets.js.folder');
    output = output || Elixir.config.get('public.js.outputFolder');

    if ((0, _lodash.isObject)(src)) {
        src = (0, _lodash.values)(src);
    }

    if ((0, _IsVersioning2.default)()) {
        output = (0, _VersionPath2.default)(output);
    }

    return new Elixir.GulpPaths().src(src, baseDir).output(output);
};