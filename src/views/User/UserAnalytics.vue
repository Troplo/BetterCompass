<template>
  <div>
    <v-container>
      <v-card color="card" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>Analytics</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            <v-select
              :items="computeCycles"
              item-value="cycleIds"
              item-text="name"
              v-model="selectedCycle"
              solo
              hide-details
              single-line
              placeholder="Cycle"
            ></v-select>
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-data-table
            :item-class="getClassesForItem"
            :loading="loading"
            no-data-text="Please select a cycle."
            :items="cycle"
            :headers="headers"
            :style="
              'background-color: ' +
              $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
            "
          >
          </v-data-table>
          <small
            >Scores apart from providing the raw score will not be provided on
            BetterCompass due to the complexity of supporting multiple
            providers, and their unique scoring methods (Example: NAPLAN band
            colors will not be shown).</small
          >
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "UserAnalytics",
  data() {
    return {
      loading: true,
      cycles: [],
      cycleTypes: [],
      headers: [],
      cycle: [],
      selectedCycle: null
    }
  },
  computed: {
    computeCycles() {
      let cycles = []
      this.cycles.filter((cycle) => {
        this.cycleTypes.find((type) => {
          if (cycle.type === type.enumValue) {
            if (!type.cycleIds) {
              type.cycleIds = []
            }
            cycles.push({
              cycleIds: type.cycleIds.push(cycle.id),
              ...type
            })
          }
        })
      })
      return cycles
    }
  },
  methods: {
    getClassesForItem(item) {
      console.log(item)
    },
    getCycle() {
      this.loading = true
      this.axios
        .post("/Services/AnalyticsV2.svc/GetUserResultGridByCycleIds", {
          userId: this.$store.state.user.userId,
          cycleIds: this.selectedCycle
        })
        .then((res) => {
          this.loading = false
          this.headers = res.data.d.metaData.columns.map((column) => {
            return {
              text: column.text,
              value: column.dataIndex.startsWith("cycleId")
                ? "key_" + column.dataIndex
                : column.dataIndex
            }
          })
          this.cycle = res.data.d.rows
        })
    },
    getCycles() {
      this.loading = true
      this.axios
        .post("/Services/AnalyticsV2.svc/GetCycles", {
          userIds: [this.$store.state.user.userId]
        })
        .then((res) => {
          this.loading = false
          this.cycles = res.data.d
        })
      this.axios.post("/Services/AnalyticsV2.svc/GetCycleTypes").then((res) => {
        this.cycleTypes = res.data.d
      })
    }
  },
  mounted() {
    this.getCycles()
  },
  watch: {
    selectedCycle() {
      this.getCycle()
    }
  }
}
</script>

<style scoped></style>
