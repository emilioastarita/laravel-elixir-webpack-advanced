"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (publicPath, targetPath, filename) {
    filename = filename || 'rev-manifest.json';
    publicPath = publicPath.replace(/^\//, '');

    return function () {
        this.plugin('done', function (stats) {
            var manifest = {},
                filePath = _path2.default.join(process.cwd(), targetPath, filename);

            /**
             * Recursively change manifest object
             *
             * @param value
             * @param key
             * @returns {string}
             */
            var buildManifestHandler = function buildManifestHandler(value, key) {
                if ((0, _lodash.isArray)(value)) {
                    (0, _lodash.forEach)(value, function (value) {
                        return buildManifestHandler(value, key);
                    });
                } else {
                    var originalFileName = '' + key + _path2.default.extname(value);

                    return manifest['' + publicPath + originalFileName] = '' + publicPath + value;
                }
            };

            (0, _lodash.forOwn)(stats.toJson().assetsByChunkName, buildManifestHandler);

            manifest = mergeManifestFiles(manifest, filePath);

            (0, _MkPath2.default)(_path2.default.dirname(filePath), 493, function (err) {
                if (err) {
                    throw err;
                }

                _fs2.default.writeFileSync(filePath, JSON.stringify(manifest, null, 2));
            });
        });
    };
};

var _lodash = require('lodash');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _MkPath = require('./MkPath');

var _MkPath2 = _interopRequireDefault(_MkPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merging with exists manifest file
 *
 * @param manifestObject
 * @param filePath
 * @returns object
 */
var mergeManifestFiles = function mergeManifestFiles(manifestObject, filePath) {
    if (!_fs2.default.existsSync(filePath)) {
        return manifestObject;
    }

    try {
        return (0, _lodash.merge)(JSON.parse(_fs2.default.readFileSync(filePath)), manifestObject);
    } catch (ex) {
        return manifestObject;
    }
};

/**
 * Revision Webpack plugin
 * Extracting hashed assets path to manifest file.
 *
 * @param publicPath
 * @param targetPath
 * @param filename
 * @returns {Function}
 */
;