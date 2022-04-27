<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card color="card" class="rounded-xl">
            <v-toolbar color="toolbar">
              <v-toolbar-title> Users </v-toolbar-title>
            </v-toolbar>
            <v-container>
              <h1 class="text-center" style="font-size: 69px">
                {{ admin.users }}
              </h1>
            </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="card" class="rounded-xl">
            <v-toolbar color="toolbar">
              <v-toolbar-title> Themes </v-toolbar-title>
            </v-toolbar>
            <v-container>
              <h1 class="text-center" style="font-size: 69px">
                {{ admin.themes }}
              </h1>
            </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="card" class="rounded-xl">
            <v-toolbar color="toolbar">
              <v-toolbar-title> Feedback </v-toolbar-title>
            </v-toolbar>
            <v-container>
              <h1 class="text-center" style="font-size: 69px">
                {{ admin.feedback }}
              </h1>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <Chart
            v-if="metrics"
            :chart-options="options"
            :chart-data="metrics"
            :height="250"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { Line as Chart } from "vue-chartjs/legacy"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)
export default {
  name: "AdminHome",
  props: ["admin", "metrics"],
  components: {
    Chart
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        }
      }
    }
  }
}
</script>

<style scoped></style>
