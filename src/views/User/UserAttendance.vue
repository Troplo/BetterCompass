<template>
  <v-container>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card elevation="7" class="rounded-xl" color="card">
      <v-toolbar color="toolbar">
        <v-toolbar-title>
          Attendance per Class
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="rangeDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Date range"
                readonly
                solo
                hide-details
                single-line
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="rangeDate"
              range
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(rangeDate); getAttendanceSummary()"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-data-table
          :style="
              'background-color: ' +
              $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
            " class="rounded-xl mb-3" :headers="headers" :items="attendanceSummary"></v-data-table>
      </v-container>
    </v-card>
    <v-card elevation="7" class="rounded-xl mt-5" color="card">
      <v-toolbar color="toolbar">
        <v-toolbar-title>
          Attendance per Term
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-select
            v-model="termYear"
            label="Year"
            :items="years"
            solo
            hide-details
            single-line
          ></v-select>
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-data-table
          :style="
              'background-color: ' +
              $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
            " class="rounded-xl mb-3" :headers="termAttendanceHeaders" :items="termAttendanceSummary"></v-data-table>
      </v-container>
    </v-card>
    <v-card elevation="7" class="mt-5 rounded-xl" color="card">
      <v-toolbar color="toolbar">
        <v-toolbar-title>
          Attendance Calendar
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <year-calendar v-model="year" :activeDates.sync="daySummary"></year-calendar>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import YearCalendar from "vue-material-year-calendar"

export default {
  name: "UserAttendance",
  props: ["user"],
  components: {
    YearCalendar
  },
  data() {
    return {
      menu: false,
      rangeDate: [
        this.$date().startOf('year').format("YYYY-MM-DD"),
        this.$date().format("YYYY-MM-DD")
      ],
      years: [],
      loading: true,
      year: this.$date().year(),
      daySummary: [],
      attendanceSummary: [],
      termAttendanceSummary: [],
      termYear: this.$date().year(),
      termAttendanceHeaders: [
        { text: "Name", value: "termName" },
        { text: "Days not attended", value: "termCount" },
        { text: "Days not attended (Excluding half-days)", value: "wholeCounted" },
      ],
      headers: [
        { text: "Subject", value: "sn" },
        { text: "Class", value: "an" },
        { text: "Form", value: "fg" },
        { text: "Run", value: "im"},
        { text: "Present", value: "p"},
        { text: "Late Appr", value: "la"},
        { text: "Late Un'd", value: "lu"},
        { text: "NP Schl", value: "authorizedabsence"},
        { text: "NP Prnt", value: "npa"},
        { text: "NP Un'd", value: "npu"},
        { text: "Total OoC", value: "tna"},
        { text: "Class%", value: "pa"},
        { text: "Ac'td%", value: "pok"},
      ]
    }
  },
  computed: {
    dateRangeText() {
      return this.rangeDate.join(' - ')
    },
  },
  methods: {
    generateYears() {
      const currentYear = this.$date().year()
      for (let i = 2016; i <= currentYear; i++) {
        this.years.push(i)
      }
    },
    calculateStatusColor(status) {
      if (status === 1) {
        return "success"
      } else if (status === 2) {
        return "warning"
      } else if (status === 3) {
        return "error"
      } else if (status === 4) {
        return "info"
      } else {
        return "info"
      }
    },
    getTermAttendanceSummary() {
      this.axios.post("/Services/ReferenceData.svc/GetTermAbsentDays", {
        userId: this.user.userId,
        year: this.termYear
      }).then(res => {
        this.termAttendanceSummary = res.data.d
      })
    },
    getAttendanceSummary() {
      this.loading = true
      this.axios.post("/Services/Attendance.svc/GetAttendanceSummary", {
        "startDate": this.rangeDate[0],
        "endDate": this.rangeDate[1],
        "studentStatus": "2",
        "inClass": ["0", "1"],
        "okClass": ["0", "1"],
        "vce": ["0", "1"],
        "schl": ["0", "1"],
        "perspective": "1",
        "totalWholeDayLimit": "0",
        "totalPartialDayLimit": "0",
        userId: this.user.userId,
      }).then((res) => {
        this.loading = false
        this.attendanceSummary = res.data.d
      })
    },
    getHalfDaySummary() {
      this.axios.post("/Services/AttendanceV2.svc/GetHalfDaySummaryGridLines", {
        userId: this.user.userId,
        year: this.year
      }).then((res) => {
        this.daySummary = res.data.d.map(item => {
          return {
            date: item.date,
            className: this.calculateStatusColor(item.amStatus),
            title: item.amStatusDesc || "No data."
          }
        })
      })
    }
  },
  mounted() {
    this.getHalfDaySummary()
    this.getAttendanceSummary()
    this.getTermAttendanceSummary()
    this.generateYears()
  },
  watch: {
    termYear() {
      this.getTermAttendanceSummary()
    },
    year() {
      this.getHalfDaySummary()
    }
  }
}
</script>

<style scoped></style>
