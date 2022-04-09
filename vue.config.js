const WebpackAutoInject = require("webpack-auto-inject-version-next")
const Dotenv = require("dotenv-webpack")
const SentryPlugin = require("@sentry/webpack-plugin");
let plugins
if(process.env.NODE_ENV === "production") {
  plugins = [
    new SentryPlugin({
      release: process.env.RELEASE,
      include: "./dist",
    }),
    new Dotenv(),
    new WebpackAutoInject({
      // specify the name of the tag in the outputed files eg
      // bundle.js: [SHORT] Version: 0.13.36 ...
      SHORT: "Troplo Versioning [BetterCompass]",
      SILENT: true,
      PACKAGE_JSON_PATH: "./package.json",
      PACKAGE_JSON_INDENT: 2,
      components: {
        AutoIncreaseVersion: true,
        InjectAsComment: true,
        InjectByTag: true
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: true // it will increase version with every single build!
        },
        InjectAsComment: {
          tag: "Version information: {version}, Build Date: {date}",
          dateFormat: "dd/mm/yyyy; hh:MM:ss TT", // change timezone: `UTC:h:MM:ss` or `GMT:h:MM:ss`
          multiLineCommentType: false // use `/** */` instead of `//` as comment block
        },
        InjectByTag: {
          fileRegex: /\.+/,
          AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\/])+)(\[\/AIV])/g,
          dateFormat: "dd/mm/yyyy; hh:MM:ss TT"
        }
      },
      LOGS_TEXT: {
        AIS_START: "Troplo BetterCompass AIV started"
      }
    })
  ]
} else {
  plugins = [
    new Dotenv(),
    new WebpackAutoInject({
      // specify the name of the tag in the outputed files eg
      // bundle.js: [SHORT] Version: 0.13.36 ...
      SHORT: "Troplo Versioning [BetterCompass]",
      SILENT: true,
      PACKAGE_JSON_PATH: "./package.json",
      PACKAGE_JSON_INDENT: 2,
      components: {
        AutoIncreaseVersion: true,
        InjectAsComment: true,
        InjectByTag: true
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: true // it will increase version with every single build!
        },
        InjectAsComment: {
          tag: "Version information: {version}, Build Date: {date}",
          dateFormat: "dd/mm/yyyy; hh:MM:ss TT", // change timezone: `UTC:h:MM:ss` or `GMT:h:MM:ss`
          multiLineCommentType: false // use `/** */` instead of `//` as comment block
        },
        InjectByTag: {
          fileRegex: /\.+/,
          AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\/])+)(\[\/AIV])/g,
          dateFormat: "dd/mm/yyyy; hh:MM:ss TT"
        }
      },
      LOGS_TEXT: {
        AIS_START: "Troplo BetterCompass AIV started"
      }
    })
  ]
}
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compiler = require("vue-template-babel-compiler")
        return options
      })
  },
  productionSourceMap: true,
  configureWebpack: {
    plugins
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    },
    name: "BetterCompass",
    themeColor: "#181818",
    msTileColor: "#181818",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    mobileWebAppCapable: "yes"
  },
  devServer: {
    proxy: "http://localhost:23994"
  },
  transpileDependencies: ["vuetify"]
}
