<template>
  <div class="activity" v-if="headerImage">
    <v-img
        :src="headerImage"
        aspect-ratio="16/9"
    >
      <v-container fill-height fluid>
        <v-row align="center"
               justify="center">
          <v-col>
            <h1>{{ activity.SubjectName }}</h1>
            <p>{{ activity.ActivityDisplayName }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
    <v-tabs>
      <v-tab to="dashboard">
        Dashboard
      </v-tab>
      <v-tab to="schedule">
        Schedule
      </v-tab>
      <v-tab to="tasks">
        Learning Tasks
      </v-tab>
      <v-tab to="sessions">
        Sessions
      </v-tab>
      <v-tab to="resources">
        Resources
      </v-tab>
      <v-tab to="roll">
        Roll
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
          <span>
            This is a BetterCompass exclusive feature.
          </span>
        </v-tooltip>
      </v-tab>
    </v-tabs>
    <router-view :activity="activity" :activityFull="activityFull" :resources="resources"></router-view>
  </div>
</template>

<script>
export default {
  name: "Activity",
  data() {
    return {
      activity: {},
      activityFull: {},
      resources: {},
      headerImage: "",
      type: "day",
    }
  },
  methods: {
    getActivity() {
      this.axios.post("/Services/Activity.svc/GetLessonsByInstanceIdQuick", {
        instanceId: this.$route.params.id
      }).then(res => {
        this.activity = res.data.d
        this.axios.post("/Services/Wiki.svc/GetActivityAndSubjectResourcesNode", {
          activityId: this.activity.ActivityId
        }).then(res => {
          this.resources = res.data.d.children[0]
        })
        this.axios.post("/Services/Activity.svc/GetHeaderImageUrlByActivityId", {
          activityId: this.activity.ActivityId
        }).then(res => {
          this.headerImage = this.$store.state.school.fqdn + res.data.d.replace("assetPath", "Assets12.1.155.1")
        })
      });
      this.axios.post("/Services/Activity.svc/GetLessonsByInstanceId", {
        instanceId: this.$route.params.id
      }).then(res => {
        this.activityFull = res.data.d
      });
    }
  },
  mounted() {
    this.getActivity()
  }
}
</script>

<style scoped>

</style>