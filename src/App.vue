<template>
  <v-app>
    <v-overlay :value="$store.state.site.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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

div .theme--dark.v-calendar-events .v-event-timed {
  border: 1px transparent !important;
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
</style>
<script>
import Header from './components/Header.vue'
export default {
  name: 'App',
  components: {
    Header
  },
  data: () => ({
    //
  }),
  mounted() {
    document.title = this.$route.name + " - BetterCompass"
    this.$vuetify.theme = {dark: true}
    this.$store.commit("setSchool", {
      name: localStorage.getItem("schoolName"),
      id: localStorage.getItem("schoolId"),
      fqdn: localStorage.getItem("schoolFqdn"),
      instance: localStorage.getItem("schoolInstance")
    })
    // set CompassApiKey header in axios
    this.axios.defaults.headers.common['CompassApiKey'] = localStorage.getItem('apiKey')
    this.axios.defaults.headers.common['compassInstance'] = localStorage.getItem('schoolInstance')
    this.$store.dispatch("getUserInfo")
  },
  watch: {
    $route(to) {
      document.title = to.name + " - BetterCompass"
    }
  }
};
</script>
