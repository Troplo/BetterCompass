import Vue from "vue"
import Vuex from "vuex"
import dayjs from "dayjs"
import Vuetify from "../plugins/vuetify"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    school: null,
    online: true,
    editMode: false,
    calendar: [],
    calendars: [],
    versioning: {
      date: process.env.VUE_APP_BUILD_DATE,
      version: process.env.VUE_APP_VERSION,
      release: process.env.RELEASE
    },
    site: {
      release: "beta",
      loading: true
    },
    user: {
      bcUser: null,
      loggedIn: false
    },
    parent: null,
    upcomingEvents: [],
    alerts: [],
    token: null,
    subjects: [],
    events: [],
    focus: dayjs().format("YYYY-MM-DD"),
    calendarInit: false,
    modals: {
      guidedWizard: true,
      settings: false,
      search: false
    },
    quickSwitchCache: []
  },
  mutations: {
    setCalendars(state, calendars) {
      state.calendars = calendars
    },
    setCalendar(state, value) {
      state.calendar = value
    },
    setEditMode(state, value) {
      state.editMode = value
    },
    setCalendarInit(state, value) {
      state.calendarInit = value
    },
    setEvents(state, events) {
      state.events = events
    },
    setOnline(state, online) {
      state.online = online
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
    setSearch(state, value) {
      state.modals.search = value
    },
    updateQuickSwitchCache(state, value) {
      state.quickSwitchCache.push({
        ...value,
        subjectLongName: value.name
          ? value.subjectLongName + " (" + value.name + ")"
          : value.subjectLongName
      })
    }
  },
  actions: {
    logout(context) {
      Vue.axios
        .post("/api/v1/user/logout")
        .then(() => {
          context.commit("setUser", null)
          context.commit("setToken", null)
          context.commit("setSchool", null)
          context.commit("setCalendar", null)
          context.commit("setCalendars", [])
          context.commit("setEditMode", false)
          context.commit("setCalendarInit", false)
          context.commit("setEvents", [])
          context.commit("setUpcomingEvents", [])
          context.commit("setAlerts", [])
          context.commit("setSubjects", [])
          localStorage.removeItem("apiKey")
          localStorage.removeItem("userId")
          localStorage.removeItem("calendarCache")
          localStorage.removeItem("userCache")
          localStorage.removeItem("compassScore")
          Vue.axios.defaults.headers.common["CompassAPIKey"] = null
        })
        .catch(() => {
          Vue.$toast.error("Failed to logout.")
        })
    },
    generateCache(context) {
      function subjectName(event) {
        const subject =
          context.state.subjects[
            context.state.subjects.findIndex((x) => x.name === event.title)
          ]
        if (!subject) {
          return event.longTitleWithoutTime
        } else {
          return `${subject.subjectLongName} - (${event.longTitleWithoutTime})`
        }
      }
      Vue.axios
        .post("/Services/Calendar.svc/GetCalendarEventsByUser", {
          activityId: null,
          endDate: dayjs(context.state.focus)
            .add(7, "day")
            .format("YYYY-MM-DD"),
          homePage: true,
          limit: 25,
          locationId: null,
          page: 1,
          staffIds: null,
          start: 0,
          startDate: dayjs(context.state.focus)
            .subtract(7, "day")
            .format("YYYY-MM-DD"),
          userId: context.state.user?.userId || localStorage.getItem("userId")
        })
        .then((res) => {
          context.commit(
            "setEvents",
            res.data.d.map((event) => {
              return {
                name: subjectName(event),
                content: event.longTitle,
                color: event.backgroundColor,
                start: new Date(event.start),
                end: new Date(event.finish),
                timed: !event.allDay,
                activityType: event.activityType,
                activityId: event.activityId,
                instanceId: event.instanceId
              }
            })
          )
          localStorage.setItem(
            "eventsCache",
            JSON.stringify(context.state.events)
          )
          localStorage.setItem("userCache", JSON.stringify(context.state.user))
        })
    },
    getState(context) {
      Vue.axios
        .get("/api/v1/state?v=" + context.state.versioning.version)
        .then((res) => {
          context.commit("setOnline", true)
          context.commit("setSite", res.data)
          context.commit("setLoading", false)
        })
        .catch(() => {
          context.commit("setSite", {
            release: "stable",
            loading: false,
            notification: "",
            latestVersion: "1.0.0"
          })
          context.commit("setOnline", false)
          context.commit("setLoading", false)
        })
    },
    updateQuickSwitch(context) {
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Home",
        customType: 1,
        route: "/"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Your Profile",
        customType: 1,
        route: "/user/" + context.state.user.userId + "/dashboard"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Reports",
        customType: 1,
        route: "/user/" + context.state.user.userId + "/reports"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "Events",
        customType: 1,
        route: "/user/" + context.state.user.userId + "/events"
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
        route: "/user/" + context.state.user.userId + "/tasks"
      })
      context.commit("updateQuickSwitchCache", {
        subjectLongName: "BetterCompass Settings",
        customType: 1,
        route: "/user/" + context.state.user.userId + "/settings"
      })
      Vue.axios
        .post(
          "/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup",
          {
            userId: context.state.user.userId,
            limit: 100,
            start: 0,
            page: 1,
            academicGroupId: -1
          }
        )
        .then((res) => {
          res.data.d.data.forEach((subject) => {
            context.commit("updateQuickSwitchCache", subject)
          })
        })
    },
    saveOnlineSettings(context, setting) {
      return new Promise((resolve, reject) => {
        if (setting) {
          Vue.axios
            .put("/api/v1/user/settings/full", {
              ...context.state.user.bcUser,
              ...setting
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e.response.data)
            })
        } else {
          Vue.axios
            .put("/api/v1/user/settings/full", {
              ...context.state.user.bcUser
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e.response.data)
            })
        }
      })
    },
    getUserInfo(context) {
      Vue.axios.defaults.headers.common["CompassAPIKey"] =
        localStorage.getItem("apiKey")
      Vue.axios.defaults.headers.common["compassInstance"] =
        localStorage.getItem("schoolInstance")
      Vue.axios.defaults.headers.common["compassSchoolId"] =
        localStorage.getItem("schoolId")
      Vue.axios.defaults.headers.common["compassUserId"] =
        localStorage.getItem("userId")
      return new Promise((resolve, reject) => {
        Vue.axios
          .get("/api/v1/user")
          .then((res) => {
            context.commit("setUser", res.data)
            localStorage.setItem("userCache", JSON.stringify(res.data))
            const name = res.data.bcUser.themeObject.id
            const dark = res.data.bcUser.themeObject.theme.dark
            const light = res.data.bcUser.themeObject.theme.light
            if (res.data.bcUser.accentColor) {
              res.data.bcUser.themeObject.theme.dark.primary =
                res.data.bcUser.accentColor
              res.data.bcUser.themeObject.theme.light.primary =
                res.data.bcUser.accentColor
            }
            Vuetify.framework.theme.themes.dark = dark
            Vuetify.framework.theme.themes.light = light
            Vuetify.framework.theme.themes.name = name
            Vuetify.framework.theme.themes.primaryType =
              res.data.bcUser.themeObject.theme.primaryType
            Vue.axios
              .post("/Services/NewsFeed.svc/GetMyUpcoming", {
                userId: context.state.user.userId
              })
              .then((res) => {
                context.commit("setUpcomingEvents", res.data.d)
              })
              .catch(() => {})
            Vue.axios
              .post("/Services/NewsFeed.svc/GetMyAlerts")
              .then((res) => {
                context.commit("setAlerts", res.data.d)
              })
              .catch(() => {})
            Vue.axios
              .post(
                "/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup",
                {
                  userId: context.state.user.userId,
                  limit: 100,
                  start: 0,
                  page: 1,
                  academicGroupId: -1
                }
              )
              .then((res) => {
                context.commit("setSubjects", res.data.d.data)
              })
              .catch(() => {})
            context.commit("setLoading", false)
            context.commit("setOnline", true)
            resolve(res.data)
          })
          .catch((e) => {
            if (JSON.parse(localStorage.getItem("userCache"))?.bcUser.id) {
              const user = JSON.parse(localStorage.getItem("userCache"))
              const name = user.bcUser.themeObject.id
              const dark = user.bcUser.themeObject.theme.dark
              const light = user.bcUser.themeObject.theme.light
              if (user.bcUser.accentColor) {
                user.bcUser.themeObject.theme.dark.primary =
                  user.bcUser.accentColor
                user.bcUser.themeObject.theme.light.primary =
                  user.bcUser.accentColor
              }
              Vuetify.framework.theme.themes.dark = dark
              Vuetify.framework.theme.themes.light = light
              Vuetify.framework.theme.themes.name = name
              Vuetify.framework.theme.themes.primaryType =
                user.bcUser.themeObject.theme.primaryType
              context.commit("setLoading", false)
              context.commit("setOnline", false)
              context.commit("setUser", user)
              resolve(user)
            } else {
              const theme = {
                id: 1,
                name: "BetterCompass Classic",
                primaryType: "all",
                dark: {
                  primary: "#0190ea",
                  secondary: "#757575",
                  accent: "#000000",
                  error: "#ff1744",
                  info: "#2196F3",
                  success: "#4CAF50",
                  warning: "#ff9800",
                  card: "#151515",
                  toolbar: "#191919",
                  sheet: "#181818",
                  text: "#000000",
                  dark: "#151515",
                  bg: "#151515",
                  calendarNormalActivity: "#3f51b5",
                  calendarActivityType7: "#f44336",
                  calendarActivityType8: "#4caf50",
                  calendarActivityType10: "#ff9800",
                  calendarExternalActivity: "#2196f3"
                },
                light: {
                  primary: "#0190ea",
                  secondary: "#757575",
                  accent: "#000000",
                  error: "#ff1744",
                  info: "#2196F3",
                  success: "#4CAF50",
                  warning: "#ff9800",
                  card: "#f8f8f8",
                  toolbar: "#f8f8f8",
                  sheet: "#f8f8f8",
                  text: "#000000",
                  dark: "#f8f8f8",
                  bg: "#f8f8f8",
                  calendarNormalActivity: "#3f51b5",
                  calendarActivityType7: "#f44336",
                  calendarActivityType8: "#4caf50",
                  calendarActivityType10: "#ff9800",
                  calendarExternalActivity: "#2196f3"
                }
              }
              const name = theme.id
              const dark = theme.dark
              const light = theme.light
              Vuetify.framework.theme.themes.dark = dark
              Vuetify.framework.theme.themes.light = light
              Vuetify.framework.theme.themes.name = name
              this.name = name
              console.log("Failed to load BetterCompass Account")
              context.user = null
              reject(e)
            }
          })
      })
    }
  },
  modules: {}
})
