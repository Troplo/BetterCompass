<template>
  <div>
    <v-container>
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title> Staff ({{ staff.length }}) </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card
            v-for="user in staff"
            :key="user.id"
            class="mb-3"
            @click="$router.push('/user/' + user.id)"
            color="card"
          >
            <v-container>
              <v-card-title>
                <v-avatar size="50" class="mr-4">
                  <img
                    :src="
                      '/download/cdn/square/' +
                      user.pv +
                      '?compassInstance=' +
                      $store.state.school.instance
                    "
                    alt=""
                  />
                </v-avatar>
                <v-toolbar-title>
                  {{ user.nif }}
                  <div class="subheading subtitle-1">
                    Account Created:
                    {{ $date(user.start).format("dddd, MMMM Do YYYY") }}
                  </div>
                </v-toolbar-title>
              </v-card-title>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SchoolStaff",
  data() {
    return {
      staff: []
    }
  },
  methods: {
    userStatus(user) {
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
        }
      ]
      return userStatus[user.userStatus - 1]
    },
    getStaff() {
      this.axios
        .post("/Services/User.svc/GetAllStaff", {
          start: 0
        })
        .then((res) => {
          this.staff = res.data.d
        })
    }
  },
  mounted() {
    this.getStaff()
  }
}
</script>

<style scoped></style>
