const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const proxy = require('./proxy.js');
const historyApiFallback = require('./historyApiFallback.js');
const webpackBaseConf = require('./webpack.base.conf.js')

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    cache: {
        type: 'memory',
    },
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'static/js/[name].[hash].js',
        publicPath: '/'
    },
    devServer: {
        contentBase: 'dist',
        port: 8080,
        open: false,
        overlay: true,                  // 在网页上也显示报错信息
        hotOnly: false,                 // 在生成失败的情况下，启用热模块替换（请参阅devServer.hot），而不刷新页面作为回退。
        watchOptions: {
            ignored: /node_modules/     // 观察许多文件系统会导致大量的CPU或内存使用量。可以排除一个巨大的文件夹。
        },
        proxy: proxy,
        // historyApiFallback: true,       // 单页应用时防止路径404
        historyApiFallback: historyApiFallback
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/fonts/',
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|hdr|mp3|mp4|wav|glb|gltf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/images/',
                            esModule: false,
                            type: 'javascript/auto', //在webpack5中使用旧版功能
                        }
                    }
                ],
            },
        ],
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
}

module.exports = merge(webpackBaseConf('development'), config)
