import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    compass: {
      debug: true
    },
    school: {
      name: 'Belmont High School'
    },
    user: {
      id: '5090',
      username: '',
      avatar: '',
      name: '',
      token: '',
      house: '',
      flags: [],
      email: '',
      role: 1,
      yearLevel: 0,
      yearLevelName: '',
      info: '',
      admin: false,
      firstName: '',
      lastName: '',
      parent: false
    },
    classes: []
  },
  mutations: {
    initUser (state, payload) {
      state.user.username = payload.username
      state.user.avatar = payload.avatar
      state.user.name = payload.name
      state.user.firstName = payload.firstName
      state.user.lastName = payload.lastName
      state.user.house = payload.house
      state.user.token = payload.token
      state.user.email = payload.email
      state.user.yearLevel = payload.yearLevel
      state.user.info = payload.info
      state.user.yearLevelName = payload.yearLevelName
    },
    initClasses (state, payload) {
      state.classes = payload.classes
    }
  },
  actions: {
  },
  modules: {
  }
})
