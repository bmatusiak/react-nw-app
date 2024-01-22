process.env.NODE_ENV = 'development';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

webpackConfig.devServer = {
    host:"localhost",
    port: 8080
}

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(webpackConfig.devServer, compiler);

const runServer = async () => {
    console.log('Starting server...');
    await server.start();
};

runServer();