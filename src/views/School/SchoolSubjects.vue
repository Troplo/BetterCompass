<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px" v-if="selectedSubject.classes">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            {{ selectedSubject.name }} ({{ selectedSubject.classes.length }})
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card
            color="card"
            v-for="activity in selectedSubject.classes"
            :key="activity.id"
            @click="$router.push('/activity/activity/' + activity.id)"
            class="mb-2"
          >
            <v-container>
              <v-toolbar-title>
                {{ activity.name }}
                <div class="subheading subtitle-1">
                  ID: {{ activity.id }}<br />
                  Faculty: {{ activity.facultyName }}<br />
                  Year: {{ activity.yearLevelShortName }}<br />
                  Manager: {{ getStaffById(activity.managerId).n }}
                </div>
              </v-toolbar-title>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-toolbar color="toolbar">
          <v-toolbar-title> Subjects ({{ subjects.length }}) </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card
            v-for="(subject, index) in subjects"
            :key="subject.id"
            class="mb-3"
            color="card"
            @click="openDialog(subject)"
          >
            <v-container>
              <v-card-title>
                <v-toolbar-title>
                  {{ subject.name }}
                  <div class="subheading subtitle-1">
                    ID: {{ subject.id }} - {{ $store.state.school.name }} -
                    Index: {{ index }}
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
  name: "SchoolSubjects",
  data() {
    return {
      subjects: [],
      loading: true,
      dialog: false,
      selectedSubject: {},
      staff: []
    }
  },
  methods: {
    getStaffById(id) {
      const user = this.staff.find((staff) => staff.id === id)
      if (user?.n) {
        return user
      } else {
        return {
          n: "Unknown"
        }
      }
    },
    openDialog(subject) {
      this.loading = true
      this.axios
        .post("/Services/Subjects.svc/GetStandardClassesOfSubject", {
          subjectId: subject.id
        })
        .then((res) => {
          this.selectedSubject = {
            classes: res.data.d.data,
            ...subject
          }
          this.dialog = true
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$toast.error("Something went wrong")
        })
    },
    getStaff() {
      this.axios
        .post("/Services/User.svc/GetAllStaff", {
          start: 0
        })
        .then((res) => {
          this.staff = res.data.d
        })
    },
    getSubjects() {
      this.loading = true
      this.axios
        .post("/Services/UserInclusion.svc/GetThinSubjects", {})
        .then((res) => {
          this.subjects = res.data.d
          this.loading = false
        })
    }
  },
  mounted() {
    this.getStaff()
    this.getSubjects()
  }
}
</script>

<style scoped></style>
