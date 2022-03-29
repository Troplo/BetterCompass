import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import axios from "axios"
import VueAxios from "vue-axios"
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import "./registerServiceWorker"
import VueSanitize from "vue-sanitize"
import "./plugins/dayjs"
import ApolloClient, { InMemoryCache } from "apollo-boost"
import VueApollo from "vue-apollo"
const cache = new InMemoryCache()

const apollo = new ApolloClient({
  uri: "/graphql",
  headers: {
    CompassAPIKey: localStorage.getItem("apiKey"),
    compassInstance: localStorage.getItem("schoolInstance")
  },
  cache
})

Vue.use(VueApollo)
Vue.use(VueSanitize, {
  allowedTags: [
    "address",
    "article",
    "aside",
    "footer",
    "header",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hgroup",
    "main",
    "nav",
    "section",
    "blockquote",
    "dd",
    "div",
    "dl",
    "dt",
    "figcaption",
    "figure",
    "hr",
    "li",
    "main",
    "ol",
    "p",
    "pre",
    "ul",
    "a",
    "abbr",
    "b",
    "bdi",
    "bdo",
    "br",
    "cite",
    "code",
    "data",
    "dfn",
    "em",
    "i",
    "kbd",
    "mark",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "time",
    "u",
    "var",
    "wbr",
    "caption",
    "col",
    "colgroup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "img"
  ],
  disallowedTagsMode: "discard",
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: [
      "src",
      "srcset",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      "style"
    ]
  },
  allowedStyles: {
    "*": {
      // Match HEX and RGB
      "text-align": [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      "font-size": [/^\d+(?:px|em|%)$/],
      "font-weight": [/^\d+$/],
      "font-style": [/^\d+$/],
      height: [/^\d+(?:px|em|%)$/],
      width: [/^\d+(?:px|em|%)$/]
    }
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [
    "img",
    "br",
    "hr",
    "area",
    "base",
    "basefont",
    "input",
    "link",
    "meta"
  ],
  // URL schemes we permit
  allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],

  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
})
Vue.use(require("vue-shortkey"))
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(Toast)
const apolloProvider = new VueApollo({
  defaultClient: apollo
})
new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: (h) => h(App)
}).$mount("#app")
