module.exports = {
  productionSourceMap: false,

  devServer: {
    proxy: "http://localhost:23994"
  },
  transpileDependencies: [
    'vuetify'
  ]
}
