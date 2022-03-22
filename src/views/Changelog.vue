<template>
  <div>
    <v-container>
      <v-card class="rounded-xl" elevation="7">
        <v-toolbar>
          <v-toolbar-title>BetterCompass Changelog</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card-title>
            22/03/2022
          </v-card-title>
          <ul>
            <li>Added activity resources.</li>
            <li>Added school resources.</li>
            <li>Fixed weather widget.</li>
            <li>Updated dark theme color scheme.</li>
            <li>Made light theme slightly more tolerable.</li>
            <li>Added "Provide Feedback" button on the sidebar to report bugs/suggest features.</li>
            <li>Added school events.</li>
            <li>Removed parent options on User Profile page.</li>
            <li>Add semester reports.</li>
            <li>Remove unparsed JSON from chronicle.</li>
          </ul>

          <v-card-title>
            21/03/2022
          </v-card-title>
          <ul>
            <li>Fixed the dark sidebar on light theme.</li>
            <li>Removed white border around calendar.</li>
            <li>Added calendar refresh button (which also jumps to today).</li>
            <li>Added feedback tab to learning tasks.</li>
            <li>Compass links in learning tasks will be replaced with BetterCompass equivalents.</li>
            <li>Weekly schedule will exclude weekends.</li>
            <li>"Your Profile" now won't crash if you load it as the initial route.</li>
            <li>Learning task uploader now properly supports 2 or more upload types.</li>
            <li>Extra chronicle info has been moved to a dialog.</li>
            <li>The QuickSwitcher now clears the input automatically.</li>
            <li>The PWA app has been modified so the title-bar matches the background.</li>
            <li>The calendar now recognizes substitute teacher classes.</li>
            <li>You can now see what teacher you have on the activity.</li>
            <li>The activity instance will now automatically set itself upon QuickSwitch.</li>
            <li>You can now easily change between activity instances with arrows.</li>
            <li>There is now a weather widget built into BetterCompass. (Can be disabled in BetterCompass Settings)</li>
          </ul>
          <small>BetterCompass version {{$store.state.versioning.version}}, built on {{$store.state.versioning.date}}</small>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Changelog"
}
</script>

<style scoped>

</style>