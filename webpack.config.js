const path = require('path');

module.exports = {
    mode: 'production',
    entry: [
        './src/scss/tour.scss',
        './src/Tour.ts',
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },{
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: 'css/', name: '[name].min.css'},
                    },
                    'sass-loader'
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        library: {
            name: 'tourguide',
            type: 'umd',
        },
        publicPath: '',
        filename: 'tour.js',
        path: path.resolve(__dirname, 'dist'),
    },
};