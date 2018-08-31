/* var path = require('path'),
    fs = require('fs'),
    nodeModules = {};

fs.readdirSync('node_modules')
.filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
    entry: './server.ts',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    target: 'node',
    externals: nodeModules
}; */
const path = require('path');
module.exports = {
    entry: `./server.ts`,
    target: 'node',
    externals: [
        /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    output: {
        filename: 'server.js', // output file
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "commonjs"
    },
    resolve: {
        // Add in `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [
            `./node_modules`,
            'node_modules'
        ]
    },
    resolveLoader: {
        //root: [`${root}/node_modules`],
    },
    module: {
        rules: [{
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            test: /\.ts?$/,
            use: [{loader: 'ts-loader'}]
        }]
    }
};