<template>
  <div>
    <v-container>
      <v-card class="rounded-xl ma-3" elevation="7">
        <v-container>
          <v-row>
            <v-col>
              <h3>Location</h3>
              <h1>{{activity.LocationDetails.longName}}</h1>
            </v-col>
            <v-col>
              <h3>Seats</h3>
              <h1>{{activity.LocationDetails.seatNumber}}</h1>
            </v-col>
            <v-col>
              <h3>Computers</h3>
              <h1>{{activity.LocationDetails.computerNumber}}</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card class="rounded-xl ma-3" elevation="7">
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-toolbar-title>Lesson Plan</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <html v-html="lp"></html>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ActivityDashboard",
  props: ["activity", "activityFull", "resources"],
  data() {
    return {
      lp: "<p>No lesson plan has been uploaded yet.</p>",
    }
  },
  methods: {
    getLessonPlan() {
      this.axios.get(`/Services/FileAssets.svc/DownloadFile?sessionstate=readonly&id=${this.activity.lp.fileAssetId}&nodeId=${this.activity.lp.wnid}`).then((res) => {
        this.lp = res.data.replaceAll(`<img src="/Services/FileAssets.svc/DownloadFile?`, `<img src="/Services/FileAssets.svc/DownloadFile?forceInstance=${this.$store.state.school.instance}&`);
      })
    }
  },
  mounted() {
    this.getLessonPlan()
  }
}
</script>

<style scoped>

</style>