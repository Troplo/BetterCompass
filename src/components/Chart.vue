<script>
import { Line } from "vue-chartjs/legacy"

export default {
  extends: Line,
  props: ["chartData"],
  mounted() {
    this.renderChart(
      {
        type: "line",
        labels: this.chartData.labels,
        datasets: [
          {
            label: "Uploads",
            data: this.chartData.data,
            backgroundColor: "transparent",
            borderColor: this.$vuetify.theme.themes.dark.primary,
            pointBackgroundColor: "#FFFFFF"
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        }
      }
    )
  }
}
</script>
