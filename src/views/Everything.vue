<template>
  <div v-if="$store.state.site.release === 'dev'">
    <v-container>
      <v-card class="rounded-xl" color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title>Everything</v-toolbar-title>
        </v-toolbar>
        <v-text-field label="Search Everything..." v-model="search">

        </v-text-field>
        <v-data-table :items="computedItems" :headers="headers" :items-per-page="-1" @click:row="handleClick" style="cursor: pointer">

        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Everything",
  data() {
    return {
      items: [],
      search: "",
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Description",
          value: "description"
        },
        {
          text: "Class",
          value: "class"
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Type",
          value: "type"
        },
        {
          text: "Created At",
          value: "createdAt"
        },
        {
          text: "Updated At",
          value: "updatedAt"
        }
      ]
    }
  },
  computed: {
    computedItems() {
      if(!this.search) {
        return this.items
      }
      return this.items.filter(item => {
        return item.name.toLowerCase().includes(this.search.toLowerCase()) || item.type?.toLowerCase().includes(this.search.toLowerCase()) || item.description?.toLowerCase().includes(this.search.toLowerCase()) || item.class?.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  methods: {
    handleClick(item) {
      this.$router.push(item.route)
    },
    getStatus(item) {
      if (item.students[0].submissionStatus === 1) {
        return {
          status: "pending",
          text: "Pending submission"
        }
      } else if (item.students[0].submissionStatus === 2) {
        return {
          status: "pendingLate",
          text: "Pending submission, overdue."
        }
      } else if (item.students[0].submissionStatus === 3) {
        return {
          status: "submitted",
          text: "Submitted"
        }
      } else if (item.students[0].submissionStatus === 4) {
        return {
          status: "submittedLate",
          text: "Submitted late"
        }
      } else {
        return {
          status: "unknown",
          text:
            "Unknown status, please report (status: " +
            item.students[0].submissionStatus +
            ")"
        }
      }
    },
    fetchEverything() {
      this.axios
        .post("/Services/User.svc/GetAllStaff", {
          start: 0
        })
        .then((res) => {
          this.items.push(...res.data.d.map((item) => {
            return {
              name: item.nif,
              type: "Staff",
              createdAt: this.$date(item.start).format("YYYY/MM/DD, hh:mm A"),
              updatedAt: "N/A",
              description: "N/A",
              class: "Staff",
              status: "Active",
              route: "/user/" + item.id
            };
          }))
        })
      this.axios
        .post("/Services/Attendance.svc/GetUnapproved", {
          userId: this.$store.state.user.userId,
          start: 0,
          page: 1,
          limit: 1000
        }).then((res) => {
          this.items.push(...res.data.d.data.map((item) => {
            return {
              name: item.activityName,
              type: "Attendance Unexplained",
              createdAt: this.$date(item.startString).format("YYYY/MM/DD, hh:mm A"),
              updatedAt: "N/A",
              description: "N/A",
              class: item.activityName,
              status: item.status,
              route: "/user/attendance"
            };
          }))
        })
      for (let i = 0; i < 10; i++) {
        this.axios
          .post("/Services/LearningTasks.svc/GetAllLearningTasksByUserId", {
            academicGroupId: i,
            limit: 5000,
            page: 1,
            sort: '[{"property":"dueDateTimestamp","direction":"ASC"}]',
            start: 0,
            showHiddenTasks: true,
            userId: this.$store.state.user?.userId
          })
          .then((res) => {
            this.items.push(...res.data.d.data.map((item) => {
              return {
                name: item.name,
                type: "Learning Task",
                createdAt: this.$date(item.createdTimestamp).format("YYYY/MM/DD, hh:mm A"),
                updatedAt: "N/A",
                class: item.subjectName,
                status: this.getStatus(item).text,
                route: "/user/tasks"
              };
            }))
          })
      }
    }
  },
  mounted() {
    this.fetchEverything()
  }
}
</script>

<style scoped>

</style>