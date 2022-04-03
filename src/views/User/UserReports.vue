<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card color="card" class="rounded-xl">
      <v-toolbar color="toolbar">
        <v-toolbar-title> Reports </v-toolbar-title>
      </v-toolbar>
      <v-data-table
        :items="reports"
        :headers="headers.reports"
        :style="
          'background-color: ' +
          $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
        "
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            :href="item.l + '&forceInstance=' + $store.state.school.instance"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card color="card" class="rounded-xl mt-4">
      <v-toolbar color="toolbar">
        <v-toolbar-title> Progress Reports </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-select
            :items="cycles"
            item-value="id"
            item-text="title"
            v-model="selectedCycle"
            solo
            hide-details
            single-line
          ></v-select>
        </v-toolbar-title>
      </v-toolbar>
      <Bar
        v-if="chartData.init"
        :chart-options="chartOptions"
        :chart-data="chartData"
        :height="200"
      />
      <v-data-table
        :items="progressReports.entities"
        :headers="headers.progress"
        :style="
          'background-color: ' +
          $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
        "
      >
        <template v-slot:item.name="{ item }">
          <span v-html="item.name"></span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs/legacy"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js"
import colors from "vuetify/lib/util/colors"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default {
  name: "UserReports",
  components: { Bar },
  props: ["user"],
  data() {
    return {
      chartData: {
        init: false,
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true
      },
      loading: true,
      cycles: [],
      selectedCycle: null,
      headers: {
        reports: [
          { text: "Reporting Cycle", value: "t" },
          { text: "School", value: "schoolName" },
          { text: "Actions", value: "actions" }
        ],
        progress: [{ text: "Subject", value: "name" }]
      },
      reports: [],
      config: {},
      progressReports: {}
    }
  },
  methods: {
    calculateFriendlyAOAForEntity(entity) {
      let results = []
      entity.results.forEach(function (area) {
        const areaOfAssessment =
          this.progressReports.aoas[
            this.progressReports.aoas.findIndex((x) => x.id === area.id)
          ]
        const friendlyName = areaOfAssessment.options.find(
          (x) => x.id === area.result
        )
        console.log(friendlyName.value)
        results.push(friendlyName.value)
      }, this)
      return results
    },
    calculateFriendlyAOA(area) {
      const areaOfAssessment =
        this.progressReports.aoas[
          this.progressReports.aoas.findIndex((x) => x.id === area.id)
        ]
      const friendlyName = areaOfAssessment.options.find(
        (x) => x.id === area.result
      )
      return {
        text: `(${friendlyName.value}) ${friendlyName.title}`,
        value: friendlyName.value
      }
    },
    randomColorGenerator() {
      console.log(colors)
      const approvedColors = [
        "green",
        "indigo",
        "red",
        "orange",
        "blue",
        "purple",
        "amber",
        "lightBlue",
        "deepPurple",
        "yellow",
        "teal",
        "cyan"
      ]
      const randomColor =
        colors[
          approvedColors[Math.floor(Math.random() * approvedColors.length)]
        ]
      return randomColor.base
    },
    async progressReportTable() {
      this.progressReports.aoas.forEach(function (area) {
        this.chartData.labels.push(area.title)
        this.headers.progress.push({
          text: area.title,
          value: "result." + area.id,
          id: area.id,
          options: area.options
        })
      }, this)
      this.headers.progress.push({
        text: "Total",
        value: "total"
      })
      this.progressReports.entities.forEach(function (entity) {
        const color = this.randomColorGenerator()
        this.chartData.datasets.push({
          label: entity.name.split("<br />")[0],
          data: this.calculateFriendlyAOAForEntity(entity),
          backgroundColor: [color, color, color, color, color, color]
        })
        if (!entity.result) {
          entity.result = {}
        }
        entity.results.forEach(function (area) {
          if (!entity.total) {
            entity.total = 0
          }
          entity.result[area.id] = this.calculateFriendlyAOA(area).text
          entity.total = entity.total + this.calculateFriendlyAOA(area).value
        }, this)
      }, this)
      this.chartData.init = true
    },
    getCycles() {
      this.axios
        .post("/Services/Gpa.svc/GetCyclesByUser", {
          userId: this.user.userId
        })
        .then((response) => {
          this.cycles = response.data.d
          this.selectedCycle = this.cycles[0].id
        })
    },
    getReports() {
      this.axios
        .post("/Services/Gpa.svc/GetActivitiesOverviewConfig", {
          userId: this.user.userId
        })
        .then((res) => {
          this.config = res.data.d
          this.axios
            .post("/Services/Reports.svc/GetMyReportsList", {
              userId: this.user.userId
            })
            .then(async (res) => {
              await this.progressReportTable().then(() => {})
              this.reports = res.data.d
              this.loading = false
            })
          this.axios
            .post("/Services/Gpa.svc/GetResultsByCycleAndStudent", {
              entityId: this.user.userId,
              cycleId: this.selectedCycle,
              editing: true
            })
            .then((res) => {
              this.progressReports = res.data.d
            })
        })
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo").then(() => {
      this.getCycles()
    })
  },
  watch: {
    selectedCycle() {
      this.chartData.init = false
      this.chartData.datasets = []
      this.chartData.labels = []
      this.headers.progress = [{ text: "Subject", value: "name" }]
      this.loading = true
      this.getReports()
    }
  }
}
</script>

<style scoped></style>
