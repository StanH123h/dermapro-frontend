const path = require('path-browserify');

module.exports = function override(config) {
    config.devtool=false;
    config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Don't use the 'fs' module in the browser
        path: require.resolve('path-browserify'), // Use path-browserify instead of Node.js 'path'
    };
    return config;
};