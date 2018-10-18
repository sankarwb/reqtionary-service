const path = require('path');
module.exports = {
    entry: `./server.ts`,
    target: 'node',
    mode: 'production',
    externals: [
        /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    output: {
        filename: 'server.js',
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
        rules: [{test: /\.ts$/, use: 'ts-loader'}]
    }
};