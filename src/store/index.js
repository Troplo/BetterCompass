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
    bcUser: null,
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
    setBetterCompassUser(state, user) {
      state.bcUser = user
    },
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
    updateQuickSwitchCache(state, value) {
      state.quickSwitchCache.push(value)
    }
  },
  actions: {
    updateQuickSwitch(context) {
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Home",
        customType: 1,
        route: "/"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Your Profile",
        customType: 1,
        route: "/user"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Reports",
        customType: 1,
        route: "/user/reports"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Events",
        customType: 1,
        route: "/user/events"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "School Resources",
        customType: 1,
        route: "/school/resources"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Changelog",
        customType: 1,
        route: "/changelog"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Learning Tasks",
        customType: 1,
        route: "/user/tasks"
      })
      Vue.axios.post("/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup", {
        userId: context.state.user.userId,
        limit: 100,
        start: 0,
        page: 1,
        academicGroupId: -1
      }).then((res) => {
        res.data.d.data.forEach((subject) => {
          context.commit("updateQuickSwitchCache", subject)
        })
      })
    },
    getUserInfo(context) {
      Vue.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
      Vue.axios.defaults.headers.common['compassSchoolId'] = localStorage.getItem('schoolId')
      Vue.axios.defaults.headers.common['compassUserId'] = localStorage.getItem('userId')
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
