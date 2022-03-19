import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios"
import VueAxios from "vue-axios"
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import VCalendar from 'v-calendar';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

Vue.use(require('vue-shortkey'))
Vue.use(VueCal)
Vue.use(VCalendar, {
  componentPrefix: 'vc',
});
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(Toast)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
