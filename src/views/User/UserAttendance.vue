<template>
  <v-container>
    <v-alert text type="info">
      This is incomplete, and still in development.
    </v-alert>
    <year-calendar v-model="year" :activeDates.sync="daySummary"></year-calendar>
  </v-container>
</template>

<script>
import YearCalendar from 'vue-material-year-calendar'
export default {
  name: "UserAttendance",
  components: {
    YearCalendar
  },
  data() {
    return {
      year: this.$date().year(),
      daySummary: []
    }
  },
  methods: {
    calculateStatusColor(status) {
      if(status === 1) {
        return 'success'
      } else if(status === 2) {
        return 'warning'
      } else if(status === 3) {
        return 'error'
      } else if(status === 4) {
        return 'info'
      } else {
        return 'info'
      }
    },
    getHalfDaySummary() {
      this.axios.post("/Services/AttendanceV2.svc/GetHalfDaySummaryGridLines", {
        userId: this.$store.state.user.userId,
        year: this.year,
      }).then((res) => {
        this.daySummary = res.data.d.map(item => {
          return {
            date: item.date,
            className: this.calculateStatusColor(item.amStatus),
            title: item.amStatusDesc || "No data."
          }
        });
      })
    }
  },
  mounted() {
    this.getHalfDaySummary()
  },
  watch: {
    year() {
      this.getHalfDaySummary()
    }
  }
}
</script>

<style scoped></style>
