import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    school: null,
    site: {
      release: "dev",
      loading: true
    },
    user: null,
    token: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setSchool(state, school) {
      state.school = school
    },
    setSite(state, site) {
      state.site = site
    },
    setToken(state, token) {
      state.token = token
    },
    setLoading(state, value) {
      state.site.loading = value
    }
  },
  actions: {
    getUserInfo(context) {
      Vue.axios.defaults.headers.common['CompassApiKey'] = localStorage.getItem('apiKey')
      Vue.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
      return new Promise((resolve, reject) => {
        Vue.axios.post("/services/mobile.svc/GetPersonalDetails").then((res) => {
          context.commit("setUser", res.data.d.data)
          context.commit("setLoading", false)
          resolve(res.data.d.data);
        }).catch((e) => {
          context.commit("setLoading", false)
          reject(e);
        })
      })
    }
  },
  modules: {
  }
})
