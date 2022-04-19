const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: { 
        commandPalette: [
            "./src/CommandPalette.fs.js", 
            "./src/scss/main.scss"
        ], 
        options: [ 
            "./src/Options.fs.js",
            "./src/scss/main.scss"
         ] 
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
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
                { from: "./static" },
            ],
        })
    ],
    resolve: {
        symlinks: false
    },
    output: { filename: "[name].js", path: path.resolve(__dirname, "./dist") },
}