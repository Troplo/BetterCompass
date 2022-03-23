<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
      <v-card class="rounded-xl">
        <v-toolbar>
          <v-toolbar-title>
            Reports
          </v-toolbar-title>
        </v-toolbar>
        <v-data-table :items="reports" :headers="headers.reports">
          <template v-slot:item.actions="{ item }">
            <v-btn icon :href="item.l + '&forceInstance=' + $store.state.school.instance">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-card class="rounded-xl mt-4" v-if="false">
        <v-toolbar>
          <v-toolbar-title>
            Progress Reports
          </v-toolbar-title>
        </v-toolbar>
        <v-data-table :items="reports" :headers="headers.progress">
          <template v-slot:item.actions="{ item }">
            <v-btn icon :href="item.l + '&forceInstance=' + $store.state.school.instance">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
  </div>
</template>

<script>
export default {
  name: "UserReports",
  data() {
    return {
      loading: true,
      headers: {
        reports: [
          { text: "Reporting Cycle", value: "t" },
          { text: "School", value: "schoolName" },
          { text: "Actions", value: "actions" }
        ],
        progress: [
          { text: "Subject", value: "subject" },
          { text: "Academic Achievement", value: "academicAchievement" },
          { text: "Effort", value: "effort" }
        ]
      },
      reports: [],
      config: {}
    }
  },
  methods: {
    getReports() {
      this.axios.post("/Services/Gpa.svc/GetActivitiesOverviewConfig", {
        userId: this.$store.state.user.userId
      }).then(res => {
        this.config = res.data.d
      });
      this.axios.post("/Services/Reports.svc/GetMyReportsList", {
        userId: this.$store.state.user.userId
      }).then((res) => {
        this.reports = res.data.d
        this.loading = false
      })
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo").then(() => {
      this.getReports()
    })
  }
}
</script>

<style scoped>

</style>