const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    return {
        mode: env.production ? 'production' : 'development',
        devtool: "inline-source-map",
        entry: {
            commandPalette: './src/CommandPalette.fs.js',
            options: './src/Options.fs.js',
            background: './src/Background.fs.js'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './dist'),
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'commandPalette.html',
                template: 'src/commandPalette.html',
                chunks: ['commandPalette']
            }),
            new HtmlWebpackPlugin({
                filename: 'options.html',
                template: 'src/options.html',
                chunks: ['options']
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: './public' }
                ],
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader'
                    ],
                },
            ],
        },
        resolve: {
            symlinks: false
        }
    }
}