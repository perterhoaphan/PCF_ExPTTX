"use strict";

const webpack = require("webpack");

// Fix: pptxgenjs references node:fs and node:https which are not available in browser.
// Use NormalModuleReplacementPlugin to replace node: scheme modules with empty stubs.
module.exports = {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
            // Strip the "node:" prefix so webpack can resolve as normal browser stub
            resource.request = resource.request.replace(/^node:/, "");
        }),
    ],
    resolve: {
        fallback: {
            "fs": false,
            "https": false,
            "http": false,
            "path": false,
            "stream": false,
            "zlib": false,
            "crypto": false,
            "os": false,
        },
        mainFields: ["browser", "module", "main"],
    }
};
