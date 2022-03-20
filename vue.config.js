module.exports = {
  productionSourceMap: false,
  pwa: {
    name: 'BetterCompass',
    themeColor: '#0179f3',
    msTileColor: '#0179f3',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    mobileWebAppCapable: 'yes'
  },
  devServer: {
    proxy: "http://localhost:23994"
  },
  transpileDependencies: [
    'vuetify'
  ]
}
