module.exports = {
    // 解决错误：ES Modules may not assign module.exports or exports.*, Use ESM export syntax
    sourceType: 'unambiguous',
    presets: [
        '@babel/preset-env',
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ],
}
