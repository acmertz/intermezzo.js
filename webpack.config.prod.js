const path = require('path');

module.exports = {
    mode: 'production',
    entry: './build.js',
    devtool: 'source-map',
    output: {
        filename: 'intermezzo.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Intermezzo',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            }
        ]
    }
};