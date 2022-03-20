<template>
  <div>
    <v-container>
      <v-alert type="info" class="px-3">
        Coming Soon!
      </v-alert>
      <FileBrowser :activity="activity" :resources="resources"></FileBrowser>
    </v-container>
  </div>
</template>

<script>
import FileBrowser from "@/components/browser/src/FileBrowser";
export default {
  name: "ActivityResources",
  props: ["activity", "resources"],
  components: {
    FileBrowser
  }
}
</script>

<style scoped>

</style>