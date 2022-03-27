<template>
  <v-app :style="'background-color: ' +   $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].bg">
    <v-overlay :value="$store.state.site.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!--<v-overlay :value="!$store.state.online && !$store.state.bcUser.cache">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            You are offline.
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card-text>
            <p>
              You are currently offline. Please check your internet connection and try again, or Compass is experiencing issues.
              <br>
              If you would like to mitigate this message in the future, enable the "Offline Caching" option in BetterCompass Settings.
            </p>
            <v-btn @click="retryConnection" :loading="connectionLoading">Retry</v-btn>
          </v-card-text>
        </v-container>
      </v-card>
    </v-overlay>-->
    <v-dialog v-model="$store.state.modals.search" max-width="600px">
      <v-card color="card">
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
    <v-main>
      <v-container v-if="$store.state.site.latestVersion > $store.state.versioning.version">
        <v-alert class="mx-4" type="info">
          There is a BetterCompass update available. Please CTRL+R / ⌘+R to force update. (You are on version {{ $store.state.versioning.version }}, and the latest version is {{ $store.state.site.latestVersion }})
        </v-alert>
      </v-container>
      <v-container v-if="$store.state.site.notification">
        <v-alert class="mx-4" type="info">
          {{$store.state.site.notification}}
        </v-alert>
      </v-container>
      <!--<v-container v-if="!$store.state.online">
        <v-alert class="mx-4" type="warning">
          You are currently offline, BetterCompass functionality will be limited.
        </v-alert>
      </v-container>-->
      <router-view :style="'background-color: ' + $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].bg"/>
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
  color: #ffffff;
}
.card {
  overflow: hidden;
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
    connectionLoading: false,
    update: false,
    search: "",
    results: [],
    searchInput: null,
  }),
  methods: {
    retryConnection() {
      this.connectionLoading = true
      this.$store.dispatch("getState").finally(() => {
        this.connectionLoading = false
      })
    },
    validate(value, defaultValue) {
      if(value === undefined || value === null) {
        return defaultValue
      } else {
        return value
      }
    },
  },
  mounted() {
    document.title = this.$route.name + " - BetterCompass"
    this.$store.commit("setSettings", this.settings)
    if(localStorage.getItem("settings")) {
      localStorage.removeItem("settings")
    }
    this.$vuetify.theme.dark = this.$store.state.bcUser?.theme === "dark" || true
    this.$store.commit("setSchool", {
      name: localStorage.getItem("schoolName"),
      id: localStorage.getItem("schoolId"),
      fqdn: localStorage.getItem("schoolFqdn"),
      instance: localStorage.getItem("schoolInstance")
    })
    this.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
    this.axios.defaults.headers.common['compassSchoolId'] = localStorage.getItem('schoolId')
    this.$store.dispatch("getState")
    this.$store.dispatch("getUserInfo")
        .then(() => {
          this.$store.dispatch("updateQuickSwitch")
        }).catch((e) => {
          console.log(e)
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
