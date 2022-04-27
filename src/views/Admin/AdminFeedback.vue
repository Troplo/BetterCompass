<template>
  <div>
    <v-toolbar color="toolbar">
      <v-toolbar-title>Feedback ({{ feedback.count }})</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="getFeedback" icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-card
        v-for="item in feedback.rows"
        :key="item.id"
        class="rounded-xl mb-2"
        color="card"
      >
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            Feedback -
            {{
              item.user
                ? item.user?.displayCode + ` (BCID: ${item.user?.id})`
                : item.userId || "Unknown"
            }}
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          {{ item.feedbackText.substring(0, 1000) }}
          <br />
          <small v-if="item.user">
            BetterCompass ID: {{ item.user.id }}<br />Compass ID:
            {{ item.user.compassUserId }}<br />Instance:
            {{ item.user.instance }}</small
          >
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "AdminFeedback",
  data() {
    return {
      feedback: []
    }
  },
  methods: {
    getFeedback() {
      this.axios.get("/api/v1/admin/feedback").then((res) => {
        this.feedback = res.data
      })
    }
  },
  mounted() {
    this.getFeedback()
  }
}
</script>

<style scoped></style>
