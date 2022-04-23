<template>
  <div>
    <v-container v-if="permissionError">
      <v-alert type="info" text>
        You are viewing an incomplete profile due to lack of permission. ({{
          name
        }}
        / {{ $route.params.id }})
      </v-alert>
    </v-container>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="user">
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            {{ baseRole() }}: {{ user.userFullName }} -
            {{ user.userFormGroup }} ({{ user.userHouse }}) -
            {{ user.userYearLevel }}
            <v-chip :color="userStatus.color">
              <v-icon>{{ userStatus.icon }}</v-icon>
              {{ userStatus.status }}
            </v-chip>
          </v-toolbar-title>
        </v-toolbar>
        <v-tabs background-color="transparent" class="ml-3">
          <v-tab to="dashboard"> Dashboard </v-tab>
          <v-tab to="tasks" v-if="!permissionError"> Learning Tasks </v-tab>
          <v-tab to="attendance"> Attendance </v-tab>
          <v-tab to="reports" v-if="!permissionError"> Reports </v-tab>
          <v-tab to="analytics" v-if="!permissionError"> Analytics </v-tab>
          <v-tab to="events" v-if="!permissionError"> Events </v-tab>
          <v-tab to="subjects"> Subjects </v-tab>
          <v-tab to="settings" v-if="user.userId === $store.state.user.userId">
            BetterCompass
          </v-tab>
          <v-tab to="score" v-if="compassScore"> Compass Score </v-tab>
        </v-tabs>
        <v-container>
          <router-view :user="user"></router-view>
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
      name: null,
      permissionError: false,
      user: null,
      loading: true
    }
  },
  computed: {
    compassScore() {
      return JSON.parse(localStorage.getItem("compassScoreEnabled"))
    },
    userStatus() {
      const userStatus = [
        {
          color: "green",
          icon: "mdi-check",
          status: "Active"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Inactive"
        },
        {
          color: "orange",
          icon: "mdi-clock",
          status: "Future Enrollment"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Left"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Locked"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Alumni"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Deleted"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Enrollment Application"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Pending Transfer Approval"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Pending Transfer Rejection"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "Slipstream"
        },
        {
          color: "red",
          icon: "mdi-close",
          status: "On Hold"
        },
        {
          color: "grey",
          icon: "mdi-help",
          status: "Unknown"
        }
      ]
      return userStatus[this.user.userStatus - 1]
    }
  },
  methods: {
    baseRole() {
      const userBaseRole = [
        "Guest",
        "Student",
        "Staff",
        "Parent",
        "Admin",
        "Visitor",
        "Not Authenticated",
        "Unknown"
      ]
      return userBaseRole[this.user.userRole || 6]
    },
    dayjs(date) {
      return dayjs(date)
    },
    getUserData() {
      this.name = null
      this.permissionError = false
      this.loading = true
      this.axios
        .post("/Services/User.svc/GetUserDetailsBlobByUserId", {
          userId:
            this.$store.state.user?.userId || localStorage.getItem("userId"),
          targetUserId: this.$route.params.id || this.$store.state.user?.userId
        })
        .then((res) => {
          if (!res.data.d) {
            this.loading = false
            this.permissionError = true
            this.axios
              .post("/Services/Mobile.svc/GetUsersNameById", {
                userId: this.$route.params.id
              })
              .then((res) => {
                this.name = res.data.d.data
                this.user = {
                  userId:
                    this.$route.params.id || this.$store.state.user?.userId,
                  userName: this.name,
                  userBaseRole: 8,
                  userStatus: 13,
                  userFullName: this.name
                }
              })
          } else {
            this.loading = false
            this.user = res.data.d
          }
        })
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo").then(() => {
      this.getUserData()
    })
  },
  watch: {
    "$route.params.id"() {
      this.getUserData()
    }
  }
}
</script>

<style scoped></style>
