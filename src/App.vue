<template>
  <v-app>
    <v-overlay :value="$store.state.site.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="$store.state.modals.settings" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">BetterCompass Settings</span>
          <span class="subtitle-1">Some settings may require a refresh to take effect.</span>
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="settings.dark"
            inset
            label="Dark theme"
            color="info"
            ></v-switch>
        </v-card-text>
        <v-card-text>
          <v-switch
              v-model="settings.learningTaskNotification"
              inset
              label="Show overdue learning task warning"
              color="warning"
          ></v-switch>
        </v-card-text>
        <v-card-text>
          <v-switch
              v-model="settings.weather"
              inset
              label="Show weather widget"
              color="info"
          ></v-switch>
        </v-card-text>
        <v-card-text>
          <v-switch
              v-model="settings.minimizeHeaderEvents"
              inset
              label="Minimize header events (only shows current week, and due learning tasks)"
              color="info"
          ></v-switch>
        </v-card-text>
       <!-- <v-card-text>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-on="on"
                  v-bind="attrs">
                <v-switch
                    v-model="settings.settingsSync"
                    inset
                    label="BetterSync"
                ></v-switch>
              </div>
            </template>
            <span>
              This will save your settings to your BetterCompass account.
          </span>
          </v-tooltip>
        </v-card-text>-->
        <div class="mx-6">
            <small>BetterCompass version {{$store.state.versioning.version}}, built on {{$store.state.versioning.date}}</small>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="saveSettings()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="$store.state.modals.search" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">BetterCompass QuickSwitcher (BETA)</span>
        </v-card-title>
        <v-container>
          <v-autocomplete auto-select-first v-model="search" :items="$store.state.quickSwitchCache" item-text="subjectLongName" label="Search" outlined autofocus return-object :search-input.sync="searchInput">
          </v-autocomplete>
        </v-container>
      </v-card>
    </v-dialog>
    <Header></Header>
    <v-main :class="scrollbarTheme">
      <router-view/>
    </v-main>
  </v-app>
</template>
<style>
.v-btn {
  text-transform: capitalize !important;
}
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
* {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}
.troplo-nav {
  font-family: 'Roboto', sans-serif;
}

.troplo-header {
  -webkit-font-smoothing: antialiased !important;
  background: -webkit-radial-gradient(#0179f3, #0190ea) !important;
}
.troplo-header-title {
  -webkit-font-smoothing: antialiased !important;
  font-family: "JetBrains Mono", sans-serif !important;
  font-weight: 450;
  elevation: 0 !important;
  font-size: 15rem;
  font-style: italic;
  text-shadow: none !important;
  color: -webkit-radial-gradient(#0179f3, #0190ea) !important;
  -webkit-background-clip: text;
}
.troplo-title {
  font-weight: 500;
  background: -webkit-radial-gradient(#0179f3, #0190ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.theme--dark.v-sheet {
  overflow:auto !important;
  background-color: #181818 !important;
  border-color: #181818 !important;
  color: #ffffff;
}
.card {
  overflow: hidden;
}
.theme--dark.v-card {
  background-color: #151515 !important;
}


.v-calendar-daily_head-day {
  border-right: 1px transparent !important;

}

.day .v-calendar-daily_head-weekday {
  visibility: hidden !important
}

.day .v-calendar-daily_head-day-label {
  display: none !important
}

div .theme--dark.v-calendar-events .v-event-timed {
  border: 1px solid #181818 !important;
  border-radius: 5px !important;
  margin: 2px;
}

.vuecal__cell {
  height: 50px !important;
}

div .theme--dark.v-calendar-daily {
  background-color: #151515 !important;
  border: 1px transparent !important;
}

div .theme--dark.v-calendar-daily .v-calendar-daily__day {
  border: 1px transparent !important;
}

.light::-webkit-scrollbar {
  width: 15px !important;
}

.light::-webkit-scrollbar-track {
  background: #e6e6e6!important;
  border-left: 1px solid #dadada!important;
}

.light::-webkit-scrollbar-thumb {
  background: #b0b0b0!important;
  border: solid 3px #e6e6e6!important;
  border-radius: 7px!important;
}

.light::-webkit-scrollbar-thumb:hover {
  background: black!important;
}

::-webkit-scrollbar {
  width: 15px!important;
}

::-webkit-scrollbar-track {
  background: #151515!important;
}

::-webkit-scrollbar-thumb {
  background: #3e3e3e!important;
  border: solid 3px #202020!important;
  border-radius: 7px!important;
}

::-webkit-scrollbar-thumb:hover {
  background: white!important;
}

.vuecal__event-time {
  margin: 3px 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.vuecal__event {
  margin: 5px 0;
}
</style>
<script>
import Header from './components/Header.vue'
export default {
  name: 'App',
  components: {
    Header
  },
  data: () => ({
    update: false,
    search: "",
    results: [],
    searchInput: null,
    settings: {
      weather: true,
      dark: true,
      learningTaskNotification: true,
      minimizeHeaderEvents: false
    },
    settingDefaults: {
      weather: true,
      dark: true,
      learningTaskNotification: true,
      minimizeHeaderEvents: false
    },
  }),
  computed: {
    scrollbarTheme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  methods: {
    validate(value, defaultValue) {
      if(value === undefined || value === null) {
        return defaultValue
      } else {
        return value
      }
    },
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify(this.settings))
      this.$store.commit('setSettings', this.settings)
      this.$store.commit("showSettings", false)
      this.$vuetify.theme = {dark: this.$store.state.settings.dark}
    }
  },
  mounted() {
    document.title = this.$route.name + " - BetterCompass"
    if(!JSON.parse(localStorage.getItem("settings"))) {
      localStorage.setItem("settings", JSON.stringify(this.settings))
    }
    this.settings = {
      dark: this.validate(JSON.parse(localStorage.getItem("settings")).dark, this.settingDefaults.dark),
      weather: this.validate(JSON.parse(localStorage.getItem("settings")).weather, this.settingDefaults.weather),
      learningTaskNotification: this.validate(JSON.parse(localStorage.getItem("settings")).learningTaskNotification, this.settingDefaults.learningTaskNotification),
      minimizeHeaderEvents: this.validate(JSON.parse(localStorage.getItem("settings")).minimizeHeaderEvents, this.settingDefaults.minimizeHeaderEvents)
    }
    this.saveSettings()
    this.$store.commit("setSettings", this.settings)
    this.$vuetify.theme = {dark: this.$store.state.settings.dark}
    this.$store.commit("setSchool", {
      name: localStorage.getItem("schoolName"),
      id: localStorage.getItem("schoolId"),
      fqdn: localStorage.getItem("schoolFqdn"),
      instance: localStorage.getItem("schoolInstance")
    })
    this.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
    this.axios.defaults.headers.common['compassSchoolId'] = localStorage.getItem('schoolId')
    this.$store.dispatch("getUserInfo")
        .then(() => {
          this.$store.dispatch("updateQuickSwitch")
        }).catch(() => {
      this.$router.push('/login')
    })
  },
  watch: {
    $route(to) {
      document.title = to.name + " - BetterCompass"
    },
    search() {
      if(this.search) {
        if(this.search.id) {
          this.$router.push("/activity/activity/" + this.search.id)
          this.$store.commit("setSearch", false)
          this.search = null
          this.$nextTick(() => {
            this.searchInput = null
          })
        } else if(this.search.customType === 1) {
          this.$router.push(this.search.route)
          this.$store.commit("setSearch", false)
          this.search = null
          this.$nextTick(() => {
            this.searchInput = null
          })
        }
      }
    }
  }
};
</script>
