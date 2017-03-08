"use strict";

// Main modules

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _bowerWebpackPlugin = require('bower-webpack-plugin');

var _bowerWebpackPlugin2 = _interopRequireDefault(_bowerWebpackPlugin);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _isWindows = require('./modules/isWindows');

var _isWindows2 = _interopRequireDefault(_isWindows);

var _IsVersioning = require('./modules/IsVersioning');

var _IsVersioning2 = _interopRequireDefault(_IsVersioning);

var _RevManifestPlugin = require('./modules/RevManifestPlugin');

var _RevManifestPlugin2 = _interopRequireDefault(_RevManifestPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filenamePattern = (0, _IsVersioning2.default)() ? '[name]-[hash]' : '[name]';

// Built-in modules


var webpack_config = {
    debug: !Elixir.inProduction,
    context: _path2.default.resolve(_appRootPath2.default.path, Elixir.config.get('assets.js.folder')),
    plugins: [new _webpack2.default.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: filenamePattern + '.js'
    }), new _webpack2.default.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(Elixir.inProduction ? 'production' : 'development')
        }
    }), new _progressBarWebpackPlugin2.default(), new _webpack2.default.NoErrorsPlugin(), new _extractTextWebpackPlugin2.default(filenamePattern + '.css', { allChunks: true }), new _bowerWebpackPlugin2.default({
        excludes: [/.*\.less$/, /^.+\/[^\/]+\/?\*$/]
    })],
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        path: _path2.default.resolve(_appRootPath2.default.path, Elixir.config.get('public.js.outputFolder')),
        publicPath: '/' + Elixir.config.js.outputFolder + '/',
        filename: filenamePattern + '.js'
    },
    resolveLoader: {
        root: _path2.default.join(_appRootPath2.default.path, 'node_modules'),
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    },
    watchOptions: {
        aggregateTimeout: 100
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.styl$/,
            loader: _extractTextWebpackPlugin2.default.extract(['css', 'postcss', 'stylus?resolve url'])
        }, {
            test: /\.css$/,
            loader: _extractTextWebpackPlugin2.default.extract(['css', 'postcss', 'resolve-url'])
        }, {
            test: /\.(sass|scss)$/,
            loader: _extractTextWebpackPlugin2.default.extract(['css', 'postcss', 'resolve-url', 'sass?sourceMap'])
        }, {
            test: /\.html$/,
            loader: 'vue-html'
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2)(\?.+)?$/,
            include: /(\/|\\)(node_modules|bower_components)(\/|\\)/,
            loader: 'file',
            query: {
                name: (0, _isWindows2.default)() ? '[path]' + filenamePattern + '.[ext]' : '[2]',
                regExp: '(node_modules|bower_components)/(.*)'
            }
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2)(\?.+)?$/,
            exclude: /(\/|\\)(node_modules|bower_components)(\/|\\)/,
            loader: 'file',
            query: {
                name: '[path]' + filenamePattern + '.[ext]'
            }
        }]
    },
    stats: {
        colors: _gulpUtil2.default.colors.supportsColor
    },
    postcss: function postcss() {
        return [(0, _autoprefixer2.default)({ browsers: ['last 2 versions'] })];
    }
};

/**
 * Production Environment
 */
if (Elixir.inProduction) {
    webpack_config.devtool = null;

    // Output stats
    webpack_config.stats = Object.assign(webpack_config.stats, {
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    });

    // Optimization plugins
    webpack_config.plugins.push(new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        }
    }));
}

/**
 * Development mode only
 */
if (!Elixir.inProduction) {
    webpack_config.devtool = 'eval-cheap-module-source-map';
}

/**
 * If versioning is enabled then change destination path
 */
if ((0, _IsVersioning2.default)()) {
    // Versioning files should be in version build folder
    webpack_config.output.path = _path2.default.resolve(_appRootPath2.default.path, Elixir.config.publicPath, Elixir.config.versioning.buildFolder, Elixir.config.js.outputFolder);
    // Versioning plugin
    webpack_config.plugins.push(new _RevManifestPlugin2.default(webpack_config.output.publicPath, Elixir.config.get('public.versioning.buildFolder')));
    if (Elixir.config.cdn) {
        webpack_config.output.publicPath = Elixir.config.cdn + _path2.default.join('/', Elixir.config.versioning.buildFolder, Elixir.config.js.outputFolder, '/');
    }
}

/**
 * Switching on specific plugin(s) when webpack task
 * triggered in standalone mode "gulp webpack" or simple "gulp"
 */
if (!Elixir.isWatching()) {
    // [should be the first in plugins array]
    webpack_config.plugins.unshift(
    // AutoClean plugin
    {
        apply: function apply(compiler) {
            _rimraf2.default.sync(compiler.options.output.path);
        }
    });
}

exports.default = webpack_config;