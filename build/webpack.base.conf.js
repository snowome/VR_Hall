const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path')

const generateConfig = env => {
    return {
        entry: {
            'index': './src/main.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [
                        resolve(__dirname, 'node_modules'),
                        // Path.resolve(__dirname, 'src/lib'),
                    ],
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                    ],
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                attrs: ['img:src', 'img:data-src']
                            }
                        }
                    ]
                },
                {
                    test: /\.tpl$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: true,                         // 最小化的压缩
                                removeAttributeQuotes: false            // 不删除引号
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|woff2?|ttf|svg)$/,
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024,
                        },
                    },
                },
                {
                    test: /\.glsl$/,
                    loader: 'raw-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': resolve('src'),
            },
        },
        plugins: [
            // new Webpack.ProvidePlugin({
            //     $: 'jquery'
            // }),
            new HtmlWebpackPlugin(getHtmlConfig('index', 'VR展厅', env)),
        ]
    }
}
module.exports = generateConfig

function getHtmlConfig(name, title, env = 'production') {
    return {
        filename: `${name}.html`,
        template: resolve(__dirname, `../src/${name}.ejs`),
        minify: {
            collapseWhitespace: env === 'production' ? true : false
        },
        title: title,
        chunks: ['manifest', 'vendor', name],
        hash: true,
        favicon: './favicon.ico'
    }
}
