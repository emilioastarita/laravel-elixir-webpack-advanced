"use strict";

/**
 * @author Jonathan Rajavuori <jrajav@gmail.com>
 * @licence MIT
 *
 * Repository: https://github.com/jrajav/mkpath
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Asynchronous creating dir
 *
 * @param dirpath
 * @param mode
 * @param callback
 */
var mkpath = function mkpath(dirpath, mode, callback) {
    dirpath = _path2.default.resolve(dirpath);

    if (typeof mode === 'function' || typeof mode === 'undefined') {
        callback = mode;
        mode = 511 & ~process.umask();
    }

    if (!callback) {
        callback = function callback() {};
    }

    _fs2.default.stat(dirpath, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                mkpath(_path2.default.dirname(dirpath), mode, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        _fs2.default.mkdir(dirpath, mode, function (err) {
                            if (!err || err.code == 'EEXIST') {
                                callback(null);
                            } else {
                                callback(err);
                            }
                        });
                    }
                });
            } else {
                callback(err);
            }
        } else if (stats.isDirectory()) {
            callback(null);
        } else {
            callback(new Error(dirpath + ' exists and is not a directory'));
        }
    });
};

/**
 * Synchronous creating dir
 *
 * @param dirpath
 * @param mode
 */
mkpath.sync = function (dirpath, mode) {
    dirpath = _path2.default.resolve(dirpath);

    if (typeof mode === 'undefined') {
        mode = 511 & ~process.umask();
    }

    try {
        if (!_fs2.default.statSync(dirpath).isDirectory()) {
            throw new Error(dirpath + ' exists and is not a directory');
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            mkpath.sync(_path2.default.dirname(dirpath), mode);
            _fs2.default.mkdirSync(dirpath, mode);
        } else {
            throw err;
        }
    }
};

exports.default = mkpath;