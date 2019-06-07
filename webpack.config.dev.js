const path = require('path');

module.exports = {
    mode: 'development',
    entry: './build.js',
    devServer: {
        contentBase: './'
    },
    devtool: 'eval-source-map',
    output: {
        filename: 'intermezzo.js',
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