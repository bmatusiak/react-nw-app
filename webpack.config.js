const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = (process.env.NODE_ENV == 'production');

// const CopyPlugin = require('copy-webpack-plugin')
// module.exports = {
//   plugins: [
//     new CopyPlugin([{
//       from: 'node_modules/scrypt/build/Release/scrypt.node',
//       to: 'build/Release'
//     }])
//   ],
//   externals: './build/Release/scrypt'
// }

const config = {
    mode: (isProduction ? "production" : "development"),
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    }
                },
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = config
