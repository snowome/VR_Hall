module.exports = {
    sourceMap: true,
    plugins: [
        require('postcss-cssnext')()     // 使用未来的css，已经包含了autoprefixer
    ]
}
