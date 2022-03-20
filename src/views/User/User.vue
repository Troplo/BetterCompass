<template>
  <div v-if="user">
    <v-container>
      <v-card>
        <v-container>
          <h1>Student: {{ $store.state.user.reportName }} - {{ $store.state.user.formGroup }}
            ({{ $store.state.user.house }}) - Year {{ $store.state.user.yearLevel }}
            <v-chip color="green">
              <v-icon>mdi-check</v-icon>
              Active
            </v-chip>
          </h1>
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
            <router-view :chronicle="chronicle" :user="user"></router-view>
          </v-container>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "User",
  data() {
    return {
      user: null,
      chronicle: {
        offset: 0,
        period: 32,
        page: 1,
        items: []
      }
    }
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getUserData() {
      this.axios.post("/Services/User.svc/GetUserDetailsBlobByUserId", {
        userId: this.$store.state.user?.userId || localStorage.getItem("userId"),
        targetUserId: this.$store.state.user?.userId || localStorage.getItem("userId")
      }).then(res => {
        this.user = res.data.d
        this.axios.post("/Services/ChronicleV2.svc/GetUserChronicleFeed", {
              "targetUserId": this.$store.state.user?.userId || localStorage.getItem("userId"),
              "start": this.chronicle.offset,
              "pageSize": 43,
              "startDate": moment().subtract(this.chronicle.period, "months").toISOString(),
              "endDate": moment().toISOString(),
              "filterCategoryIds": [2, 16, 3, 11, 4, 9, 26, 10, 5, 29, 27, 1, 8, 14, 24, 23, 13, 15, 20, 22, 25, 19, 12, 6, 28, 21, 7, 17],
              "asParent": true,
              "page": this.chronicle.page,
              "limit": 60
            }
        ).then((res) => {
          this.chronicle.items = res.data.d.data
        })
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