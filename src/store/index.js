import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    school: null,
    versioning: {
      date: process.env.VUE_APP_BUILD_DATE,
      version: process.env.VUE_APP_VERSION
    },
    site: {
      release: "dev",
      loading: true
    },
    user: null,
    parent: null,
    upcomingEvents: [],
    alerts: [],
    token: null,
    subjects: [],
    settings: {
      dark: true
    },
    modals: {
      settings: false,
      search: false
    },
    quickSwitchCache: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setUpcomingEvents(state, events) {
      state.upcomingEvents = events
    },
    setAlerts(state, alerts) {
      state.alerts = alerts
    },
    setSubjects(state, subjects) {
      state.subjects = subjects
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
    },
    showSettings(state, value) {
      state.modals.settings = value
    },
    setSettings(state, settings) {
      state.settings = settings
    },
    setSearch(state, value) {
      state.modals.search = value
    },
    updateQuickSwitchCache(state, value, push) {
      if(push) {
        state.quickSwitchCache.push(value)
      } else {
        state.quickSwitchCache = value
      }
    }
  },
  actions: {
    quickSwitchCache(context) {
      context.commit("updateQuickSwitchCache", [context.state.quickSwitchCache, true])
    },
    getUserInfo(context) {
      Vue.axios.defaults.headers.common['CompassApiKey'] = localStorage.getItem('apiKey')
      Vue.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
      Vue.axios.defaults.headers.common['compassSchoolId'] = localStorage.getItem('schoolId')
      return new Promise((resolve, reject) => {
        Vue.axios.post("/services/mobile.svc/GetPersonalDetails", {
          userId: localStorage.getItem("userId")
        }).then((res) => {
          context.commit("setUser", res.data.d.data)
          Vue.axios.post("/Services/NewsFeed.svc/GetMyUpcoming", {
            userId: context.state.user.userId
          }).then((res) => {
            context.commit("setUpcomingEvents", res.data.d)
          }).catch(() => {})
          Vue.axios.post("/Services/NewsFeed.svc/GetMyAlerts").then((res) => {
            context.commit("setAlerts", res.data.d)
          }).catch(() => {})
          Vue.axios.post("/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup", {
            userId: context.state.user.userId,
            limit: 100,
            start: 0,
            page: 1,
            academicGroupId: -1
          }).then((res) => {
            context.commit("setSubjects", res.data.d.data)
          }).catch(() => {})
          context.commit("setLoading", false)
          resolve(res.data.d.data);
        }).catch((e) => {
          context.commit("setLoading", false)
          reject(e);
        })
      })
    },
  },
  modules: {
  }
})
