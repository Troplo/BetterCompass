<template>
  <div v-if="user">
    <v-container>
      <v-card>
        <v-container>
          <h1>Student: {{$store.state.user.reportName}} - {{$store.state.user.formGroup}} ({{$store.state.user.house}}) - Year {{$store.state.user.yearLevel}} <v-chip color="green"><v-icon>mdi-check</v-icon> Active</v-chip></h1>
          <v-tabs>
            <v-tab to="dashboard">
              Dashboard
            </v-tab>
            <v-tab to="tasks">
              Learning Tasks
            </v-tab>
            <v-tab to="attendance">
              Attendance
            </v-tab>
            <v-tab to="reports">
              Reports
            </v-tab>
            <v-tab to="analytics">
              Analytics
            </v-tab>
            <v-tab to="analytics">
              Conferences
            </v-tab>
            <v-tab to="analytics">
              Contributions
            </v-tab>
            <v-tab to="analytics">
              Payments
            </v-tab>
            <v-tab to="analytics">
              Communications
            </v-tab>
          </v-tabs>
          <v-container>
            <router-view :user="user"></router-view>
          </v-container>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      user: null
    }
  },
  methods: {
    getUserData() {
      this.axios.post("/Services/User.svc/GetUserDetailsBlobByUserId", {
        userId: this.$store.state.user?.userId || localStorage.getItem("userId"),
        targetUserId: this.$store.state.user?.userId || localStorage.getItem("userId")
      }).then(res => {
        this.user = res.data.d
      });
    }
  },
  mounted() {
    this.getUserData();
  }
}
</script>

<style scoped>

</style>