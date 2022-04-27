<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="admin">
      <v-card color="card" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>Admin</v-toolbar-title>
        </v-toolbar>
        <v-tabs background-color="transparent">
          <v-tab to="/admin/dashboard">
            <v-icon>mdi-view-dashboard</v-icon>
            <span>Dashboard</span>
          </v-tab>
          <v-tab to="/admin/users">
            <v-icon>mdi-account-multiple</v-icon>
            <span>Users</span>
          </v-tab>
        </v-tabs>
        <router-view :admin="admin"></router-view>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import AjaxErrorHandler from "@/lib/errorHandler"

export default {
  name: "Admin",
  data() {
    return {
      admin: null,
      loading: true
    }
  },
  methods: {
    getAdminInfo() {
      this.loading = true
      this.axios
        .get("/api/v1/admin")
        .then((res) => {
          this.loading = false
          this.admin = res.data
        })
        .catch((e) => {
          this.loading = false
          AjaxErrorHandler(e)
          this.$router.push("/")
        })
    }
  },
  mounted() {
    this.getAdminInfo()
  }
}
</script>

<style scoped></style>
