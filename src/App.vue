<template>
  <v-app>
    <v-overlay :value="$store.state.site.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="$store.state.modals.settings" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">BetterCompass Settings</span>
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
          <v-autocomplete auto-select-first v-model="search" :items="$store.state.subjects" item-text="subjectLongName" label="Search" outlined autofocus return-object :search-input.sync="searchInput">
          </v-autocomplete>
        </v-container>
      </v-card>
    </v-dialog>
    <Header></Header>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
<style>
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
  background-color: #151515 !important;
  border-color: #151515 !important;
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

/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: black #151515;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #0e0e0e;
}

*::-webkit-scrollbar-thumb {
  background-color: #151515;
  border-radius: 20px;
  border: 3px solid #151515;
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
    search: "",
    results: [],
    searchInput: null,
    settings: {
      weather: true,
      dark: true,
      learningTaskNotification: true
    }
  }),
  methods: {
    filterItems(needle, heystack) {
      let query = needle.toLowerCase();
      return heystack.filter(item => item.subjectLongName.toLowerCase().indexOf(query) >= 0);
    },
    doSearch(search) {
      console.log(search)
      if(search.length > 0) {
        this.results = this.filterItems(search, this.$store.state.subjects)
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
    this.settings = JSON.parse(localStorage.getItem("settings"))
    if(JSON.parse(localStorage.getItem("settings")).weather === null) {
      localStorage.setItem("settings", JSON.stringify({
        weather: true,
        dark: this.settings.dark,
        learningTaskNotification: this.settings.learningTaskNotification
      }))
      this.settings = JSON.parse(localStorage.getItem("settings"))
    }
    this.settings = JSON.parse(localStorage.getItem("settings"))
    this.$store.commit("setSettings", JSON.parse(localStorage.getItem("settings")))
    this.$vuetify.theme = {dark: this.$store.state.settings.dark}
    this.$store.commit("setSchool", {
      name: localStorage.getItem("schoolName"),
      id: localStorage.getItem("schoolId"),
      fqdn: localStorage.getItem("schoolFqdn"),
      instance: localStorage.getItem("schoolInstance")
    })
    // set CompassApiKey header in axios
    this.axios.defaults.headers.common['CompassApiKey'] = localStorage.getItem('apiKey')
    this.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
    this.axios.defaults.headers.common['compassSchoolId'] = localStorage.getItem('schoolId')
    this.$store.dispatch("getUserInfo").catch(() => {
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
        }
      }
    }
  }
};
</script>
