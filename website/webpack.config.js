const path = require('path');

module.exports = {
    mode: 'development',
    entry: './assets/js/site.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader", // Creates `style` nodes from JS strings
                    "css-loader", // Translates CSS into CommonJS
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require("sass"),
                        },
                    }, // Compiles Sass to CSS
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'site.js',
        // path: path.resolve(__dirname, 'dist'),
        path: path.resolve('../dist', 'js'),
    },
};