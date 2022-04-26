<template>
  <div>
    <v-container>
      <v-data-table
        :items="subjects.Activities"
        :headers="headers"
        @click:row="handleClick"
        style="cursor: pointer"
        :style="
          'background-color: ' +
          $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
        "
      >
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "UserSubjects",
  props: ["user"],
  data() {
    return {
      subjects: [],
      headers: [
        {
          text: "ID",
          value: "ActivityId"
        },
        {
          text: "Name",
          value: "ActivityName"
        },
        {
          text: "Subject ID",
          value: "SubjectId",
          sortable: false
        }
      ],
      loading: true
    }
  },
  methods: {
    handleClick(item) {
      this.$router.push("/activity/activity/" + item.ActivityId)
    },
    getSubjects() {
      this.loading = true
      this.axios
        .post("/Services/Gpa.svc/GetActivitiesOverviewConfig", {
          userId: this.user.userId || this.$store.state.user.userId
        })
        .then((res) => {
          this.subjects = res.data.d
          this.getReports()
          this.loading = false
        })
    },
    getReports() {
      this.axios.post("/Services/Gpa.svc/GetOverviewGraphDataForActivities", {
        activityIds: this.subjects.Activities.map((s) => s.ActivityId),
        userId: this.user.userId || this.$store.state.user.userId,
        cycleIds: [23]
      })
    }
  },
  mounted() {
    this.getSubjects()
  }
}
</script>

<style scoped></style>
