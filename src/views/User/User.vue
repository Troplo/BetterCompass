<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="user">
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-container>
          <h1>
            Student: {{ $store.state.user.reportName }} -
            {{ $store.state.user.formGroup }} ({{ $store.state.user.house }}) -
            Year {{ $store.state.user.yearLevel }}
            <v-chip color="success">
              <v-icon>mdi-check</v-icon>
              Active
            </v-chip>
          </h1>
          <v-tabs background-color="card">
            <v-tab to="dashboard"> Dashboard </v-tab>
            <v-tab to="tasks"> Learning Tasks </v-tab>
            <v-tab to="attendance"> Attendance </v-tab>
            <v-tab to="reports"> Reports </v-tab>
            <v-tab to="analytics"> Analytics </v-tab>
            <v-tab to="events"> Events </v-tab>
            <v-tab to="settings"> BetterCompass </v-tab>
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
import dayjs from "dayjs"

export default {
  name: "User",
  data() {
    return {
      user: null,
      loading: true,
      chronicle: {
        offset: 0,
        period: 32,
        page: 1,
        items: []
      }
    }
  },
  methods: {
    dayjs(date) {
      return dayjs(date)
    },
    getUserData() {
      this.loading = true
      this.axios
        .post("/Services/User.svc/GetUserDetailsBlobByUserId", {
          userId:
            this.$store.state.user?.userId || localStorage.getItem("userId"),
          targetUserId:
            this.$store.state.user?.userId || localStorage.getItem("userId")
        })
        .then((res) => {
          this.loading = false
          this.user = res.data.d
          this.axios
            .post("/Services/ChronicleV2.svc/GetUserChronicleFeed", {
              targetUserId:
                this.$store.state.user?.userId ||
                localStorage.getItem("userId"),
              start: this.chronicle.offset,
              pageSize: 43,
              startDate: dayjs()
                .subtract(this.chronicle.period, "months")
                .toISOString(),
              endDate: dayjs().toISOString(),
              filterCategoryIds: [
                2, 16, 3, 11, 4, 9, 26, 10, 5, 29, 27, 1, 8, 14, 24, 23, 13, 15,
                20, 22, 25, 19, 12, 6, 28, 21, 7, 17
              ],
              asParent: true,
              page: this.chronicle.page,
              limit: 60
            })
            .then((res) => {
              this.chronicle.items = res.data.d.data
            })
        })
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo").then(() => {
      this.getUserData()
    })
  }
}
</script>

<style scoped></style>
