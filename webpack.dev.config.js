const path = require('path');
module.exports = {
    entry: `./server.ts`,
    target: 'node',
    mode: 'development',
    externals: [
        /^[a-z\-0-9]+$/
    ],
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [`./node_modules`,'node_modules']
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [{loader: 'ts-loader'}]
        }]
    }
};