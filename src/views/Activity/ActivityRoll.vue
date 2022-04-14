<template>
  <div>
    <v-container>
      <v-card color="card" class="rounded-xl" elevation="7">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            Class Roll
          </v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers" :items="users" :items-per-page="-1"
                      :style="
          'background-color: ' +
          $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
        ">
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ActivityRoll",
  props: ["activity"],
  data() {
    return {
      loading: true,
      users: [],
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        {
          text: "Code",
          align: "left",
          value: "ii"
        },
        {
          text: "Year Level",
          align: "left",
          value: "yl"
        },
        {
          text: "Form Group",
          align: "left",
          value: "f"
        },
        {
          text: "User ID",
          align: "left",
          value: "uid"
        }
      ]
    }
  },
  methods: {
    getUsers() {
      this.loading = true
      this.axios
        .post("/Services/Activity.svc/GetEnrolmentsByActivityId", {
          activityId: this.activity.ActivityId,
          limit: 200,
          page: 1,
          start: 0
        })
        .then((res) => {
          // strip out duplicate users
          let users = []
          res.data.d.forEach((user) => {
            if (users.findIndex((u) => u.uid === user.uid) === -1) {
              users.push({
                name: user.n.split(", ")[1] + " " + user.n.split(", ")[0],
                ...user
              })
            }
          })
          this.users = users
          this.loading = false
        })
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped></style>
