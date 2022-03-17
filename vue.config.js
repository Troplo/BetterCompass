module.exports = {
  devServer: {
    proxy: "http://localhost:3001"
  },
  transpileDependencies: [
    'vuetify'
  ]
}
