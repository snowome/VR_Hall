const express = require('express')
const webpack = require('webpack')
const opn = require('opn')

const APP = express()
const PORT = 8080

const config = require('./webpack.base.conf.js')('development')
const compiler = webpack(config)

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware')
const historyApiFallback = require('connect-history-api-fallback')
const staticMiddleWare = express.static(config.output.publicPath)


const proxyTable = require('./proxy')
for (let context in proxyTable) {
    APP.use(proxyMiddleware(context, proxyTable[context]))
}
APP.use(historyApiFallback(require('./historyApiFallback.js')))
APP.use(webpackDevMiddleware(compiler, Object.assign({}, {publicPath: config.output.publicPath}, config.devServer)))
APP.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}))
APP.use(webpackHotMiddleware(compiler))

APP.use(staticMiddleWare);

APP.listen(PORT, function () {
    console.log('success listen to ' + PORT)
    opn('http://localhost:' + PORT)
})
