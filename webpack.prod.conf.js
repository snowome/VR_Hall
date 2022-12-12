const Webpack = require('webpack');
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CssMinimizerPlugin =      require('css-minimizer-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GlobAll = require('glob-all');          // 加载多路径

const webpackBaseConf = require('./webpack.base.conf.js')

const config = {
    mode: 'production',
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'static/js/[name].js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            limit: 2048,
                            publicPath: '../fonts/',
                            outputPath: 'static/',
                            useRelativePath: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|hdr|mp3|wav|glb|gltf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            limit: 2048,
                            // publicPath: '',
                            outputPath: 'static/images/',
                            // useRelativePath: true
                            esModule: false,
                            type: 'javascript/auto', //在webpack5中使用旧版功能
                        }
                    }
                ]
            },

        ],
    },
    optimization: {
        emitOnErrors: true, //  在编译时每当有错误时，就会 emit asset
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,       //打开并发
              sourceMap: false      // set to true if you want JS source maps
            }),
            new CleanWebpackPlugin()
        ],
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            // name: true,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',           // 初始化的时候就需要加载进来
                    test: /[\\/]node_modules[\\/]/,
                    // test: /jquery|lodash/        // 默认打包node_modules里并且大于30KB
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',    // merge all the css chunk to one file
                    enforce: true
                }
            }
        },
    },
    plugins: [
        new CleanWebpackPlugin('dist', {
            root: resolve(__dirname, '../'),   //根目录
            verbose: true,        　　　　　　　　　　//开启在控制台输出信息
            dry: false        　　　　　　　　　　    //启用删除文件
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                // 处理字体等json文件引入问题
                {
                    from: resolve(__dirname, '../src/_assets'),
                    to: resolve(__dirname, '../dist/_assets'),
                },
                // 处理gltf文件包含bin文件和图像文件的问题
                {
                    from: resolve(__dirname, '../src/_static'),
                    to: resolve(__dirname, '../dist/static/images'),
                },
            ],
        }),
        /** CSS TreeShaking **/
        // new PriifyCss({
        //     paths: GlobAll.sync([
        //         resolve(__dirname, '../src/page/*/*.html'),
        //         resolve(__dirname, '../src/page/*/*.ejs'),
        //         resolve(__dirname, '../src/page/*/*.js'),
        //         resolve(__dirname, '../src/view/*/*.html'),
        //         resolve(__dirname, '../src/view/*/*.ejs'),
        //     ])
        // }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
}

module.exports = merge(webpackBaseConf('production'), config)
