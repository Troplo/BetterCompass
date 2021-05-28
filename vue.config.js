module.exports = {
    devServer: {
        proxy: 'http://localhost:3001',
        disableHostCheck: true,   // dev.kaverti.flowinity
    },

    publicPath: '/',
    productionSourceMap: false,
}