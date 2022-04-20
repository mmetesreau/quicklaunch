const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    return {
        mode: env.production ? 'production' : 'development',
        devtool: "inline-source-map",
        entry: {
            commandPalette: [
                './src/CommandPalette.fs.js',
                './src/scss/main.scss'
            ],
            options: [
                './src/Options.fs.js',
                './src/scss/main.scss'
            ],
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
                    { from: './static' },
                ],
            })
        ],
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        resolve: {
            symlinks: false
        }
    }
}