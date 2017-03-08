'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Prepare path for versioned files
 * @param outputPath
 */
exports.default = function (outputPath) {
    return outputPath
    // Add leading slash if missing
    .replace(/^\/?/, '/')
    // insert build folder before js output
    .replace(new RegExp(Elixir.config.js.outputFolder), Elixir.config.versioning.buildFolder + '/' + Elixir.config.js.outputFolder);
};