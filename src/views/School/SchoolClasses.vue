<template>
  <div>
    <v-container>
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title> Classes ({{subjects.length}}) </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card
            v-for="(subject, index) in subjects"
            :key="subject.id"
            class="mb-3"
            color="card"
          >
            <v-container>
              <v-card-title>
                <v-toolbar-title>
                  {{ subject.name }}
                  <div class="subheading subtitle-1">
                    ID: {{ subject.id }} - {{ $store.state.school.name }} - Index: {{ index }}
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
      loading: true
    }
  },
  methods: {
    getSubjects() {
      this.loading = true
      this.axios.post("/Services/UserInclusion.svc/GetThinSubjects", {

      }).then((res) => {
        this.subjects = res.data.d
        this.loading = false
      })
    }
  },
  mounted() {
    this.getSubjects()
  }
}
</script>

<style scoped>

</style>