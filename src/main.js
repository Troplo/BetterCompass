import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(Buefy)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
axios.defaults.withCredentials = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
