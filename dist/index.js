"use strict";

/**
 * Require main dependencies
 */

var _lodash = require('lodash');

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _GulpPaths = require('./modules/GulpPaths');

var _GulpPaths2 = _interopRequireDefault(_GulpPaths);

var _IsVersioning = require('./modules/IsVersioning');

var _IsVersioning2 = _interopRequireDefault(_IsVersioning);

var _VersionPath = require('./modules/VersionPath');

var _VersionPath2 = _interopRequireDefault(_VersionPath);

var _EntryPaths = require('./modules/EntryPaths');

var _EntryPaths2 = _interopRequireDefault(_EntryPaths);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helpers
 */
var taskName = 'webpack';

/**
 * Webpack spec
 */


/**
 * Built-in modules
 */
Elixir.extend(taskName, function (src, options, globalVars) {
    var paths = (0, _GulpPaths2.default)(src),
        globalConfig = Object.assign({}, _Config2.default),
        entry = (0, _EntryPaths2.default)(src);

    /**
     * In next major release this will be removed
     * TODO mark as deprecated
     */
    if ((0, _lodash.isPlainObject)(globalVars)) {
        globalConfig.plugins.push(new _webpack2.default.ProvidePlugin(globalVars));
    }

    var originalPublicPath = globalConfig.output.publicPath;
    // Merge options
    options = (0, _lodash.mergeWith)(globalConfig, options, { entry: entry, watch: Elixir.isWatching() }, function (objValue, srcValue) {
        if ((0, _lodash.isArray)(objValue)) {
            return objValue.concat(srcValue);
        }
    });

    if ((0, _IsVersioning2.default)()) {
        options.output.publicPath = (0, _VersionPath2.default)(options.output.publicPath);
    }
    if (Elixir.config.cdn) {
        options.output.publicPath = originalPublicPath;
    }
    /**
     * Webpack task
     */
    new Elixir.Task(taskName, function () {
        this.recordStep !== undefined && this.recordStep('Building js files');
        (0, _webpack2.default)(options, function (err, stats) {
            if (err) {
                return;
            }

            _gulpUtil2.default.log(stats.toString(options.stats));
        });
    }, paths);
});