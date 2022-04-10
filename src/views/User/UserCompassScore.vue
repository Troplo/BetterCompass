<template>
  <div>
    <v-dialog v-model="scoreDialog" max-width="600px">
      <v-card :color="computeBasedOnScore.color">
        <v-toolbar :color="computeBasedOnScore.color">
          <v-toolbar-title>Your CompassScore™</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="scoreDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="justify-center text-center">
          <h1 style="font-size: 150px">{{ Math.round(score) }}%</h1>
          <h2>{{ computeBasedOnScore.text }}</h2>
          <p>{{ computeBasedOnScore.description }}</p>
          <v-data-table
            :headers="inDepthHeaders"
            :items="inDepthResults"
            style="background-color: transparent"
            hide-default-footer
          >
          </v-data-table>
        </v-container>
        <v-card-actions>
          <v-btn text disabled> 01/04/2022 </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click.native="scoreDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card color="card" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>CompassScore™</v-toolbar-title>
        </v-toolbar>
        <v-container class="justify-center text-center">
          <h1 style="font-size: 50px" class="troplo-title">CompassScore™</h1>
          <p>The Score that Grades you More™</p>
        </v-container>
        <v-container>
          <v-row>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">AT A GLANCE</div>
                    <v-list-item-title class="text-h5 mb-1">
                      An accurate representation of your current & future
                      education.
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >With a single number, CompassScore can accurately predict
                      whether you're going to fail.</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-speedometer</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">INFORMATION</div>
                    <v-list-item-title class="text-h5 mb-1">
                      Over 3,000 database entries are used to calculate your
                      score.
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >Our vigorous data collection process ensures that we have
                      the most accurate data.</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-information</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">FAQ</div>
                    <v-list-item-title class="text-h5 mb-1">
                      Is this arbitrary?
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      No. CompassScore uses mathematical models, and advanced
                      mathematical techniques to calculate your score to provide
                      a realistic representation of your future education.
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-calculator</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">FAQ</div>
                    <v-list-item-title class="text-h5 mb-1">
                      How secure is this?
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      We retain backups for 7 years, and we ensure your session
                      expires after 3 days, <b>or more</b>.<br />
                      We are also PCI DSS Level 1 Compliant, despite using
                      Cloudflare's Flexible SSL which is not PCI DSS complaint.
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-lock</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">FAQ</div>
                    <v-list-item-title class="text-h5 mb-1">
                      Can I get more than 100%?
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Yes, the score is out of 110%, because we believe that
                      100% is too low for top-grade students.
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-counter</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline">FAQ</div>
                    <v-list-item-title class="text-h5 mb-1">
                      If I get 110%, can I put this on my resume or CV?
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Yes, you can put this on your resume, but not your CV.
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar tile size="80">
                    <v-icon style="font-size: 80px">mdi-file-account</v-icon>
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    text
                    @click="getScore"
                    :loading="loading"
                  >
                    Get your score
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "UserCompassScore",
  data() {
    return {
      scoreDialog: false,
      score: 0,
      learningTaskResultScore: 0,
      loading: false,
      gradingSchemes: [],
      inDepthResults: [],
      inDepthHeaders: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Percentage",
          value: "percentage"
        },
        {
          text: "Raw Score",
          value: "score"
        }
      ]
    }
  },
  computed: {
    computeBasedOnScore() {
      if (this.score >= 90) {
        return {
          color: "success",
          text: "You have an excellent CompassScore™.",
          description:
            "You are doing excellent at your current education. You are likely to succeed in your future endeavors."
        }
      } else if (this.score >= 80) {
        return {
          color: "success",
          text: "You have a good CompassScore™.",
          description:
            "You are doing good, but this score may lead you to a bad grade. You may need to work harder to improve your score."
        }
      } else if (this.score >= 70) {
        return {
          color: "warning",
          text: "You have an average CompassScore™.",
          description:
            "You may need to improve your educational ethic or you may fail, and miss out on potential opportunities."
        }
      } else if (this.score >= 60) {
        return {
          color: "warning",
          text: "You have a below average CompassScore™.",
          description:
            "You may need to improve your educational ethic or you may fail, and miss out on potential opportunities."
        }
      } else {
        return {
          color: "red",
          text: "You have a bad CompassScore™.",
          description:
            "You have a high chance of failing at your education, future endeavors, and missing out on potential opportunities in the future. Please contact your school to find out more."
        }
      }
    }
  },
  methods: {
    getLearningSchemes() {
      this.loading = true
      this.axios
        .get(
          "/Services/ReferenceDataCache.svc/GetGradingSchemesForLearningTasks"
        )
        .then((res) => {
          this.loading = false
          this.gradingSchemes = res.data.d
        })
    },
    getGradingSchemeLength(gradingItem) {
      const scheme = this.gradingSchemes.find(
        (scheme) => scheme.measureUniqueId === gradingItem.measureUniqueId
      )
      return scheme.options.filter((scale) => scale.value !== "null").length
    },
    getGradingScheme(gradingItem, result) {
      const scheme = this.gradingSchemes.find(
        (scheme) => scheme.measureUniqueId === gradingItem.measureUniqueId
      )
      if (scheme) {
        const option = scheme.options.find(
          (option) => option.value === result.toString()
        )
        if (option) {
          return option.displayValue
        }
      }
    },
    getStatus(item, items) {
      if (item) {
        if (item.students[0].submissionStatus === 1) {
          return true
        } else if (item.students[0].submissionStatus === 2) {
          return false
        } else if (item.students[0].submissionStatus === 3) {
          return true
        } else if (item.students[0].submissionStatus === 4) {
          return true
        } else {
          return false
        }
      } else {
        let falseCount = 0
        let totalCount = 0
        items.forEach((item) => {
          totalCount++
          if (item.students[0].submissionStatus === 1) {
            falseCount++
          } else if (item.students[0].submissionStatus === 3) {
            falseCount++
          } else if (item.students[0].submissionStatus === 4) {
            falseCount++
          }
        })
        return {
          totalCount,
          falseCount
        }
      }
    },
    getScore() {
      this.loading = true
      this.axios
        .post("/Services/LearningTasks.svc/GetAllLearningTasksByUserId", {
          forceTaskId: 0,
          limit: 2000,
          page: this.page,
          sort: '[{"property":"dueDateTimestamp","direction":"ASC"}]',
          start: this.offset,
          showHiddenTasks: true,
          userId: this.$route.params.id || this.$store.state.user?.userId
        })
        .then((res) => {
          let taskScore = 0
          let taskScoreOutOf = 0
          let score1
          let score2
          let score3
          this.axios
            .post("/Services/ReferenceData.svc/GetTermAbsentDays", {
              userId: this.$route.params.id || this.$store.state.user?.userId,
              year: this.$date().year()
            })
            .then((resp) => {
              // get each termCount from the array of objects, and add to total
              let totalCount = 0
              resp.data.d.forEach((term) => {
                totalCount += term.termCount
              })
              if (totalCount <= 2) {
                score3 = 10
              } else if (totalCount <= 5) {
                score3 = -5
              } else if (totalCount <= 20) {
                score3 = -totalCount
              } else {
                score3 = -20
              }
              if (!taskScore) {
                taskScore = 0
              }
              if (!taskScoreOutOf) {
                taskScoreOutOf = 1
              }
              score2 = (100 * taskScore) / taskScoreOutOf
              this.inDepthResults = []
              this.inDepthResults.push({
                name: "Absence Penalty or Advantage",
                score: "N/A",
                percentage: score3
              })
              this.inDepthResults.push({
                name: "Learning Task Results",
                score: taskScore + "/" + taskScoreOutOf,
                percentage: Math.round(score2)
              })
              this.inDepthResults.push({
                name: "Learning Task Submissions",
                score:
                  this.getStatus(null, res.data.d.data).falseCount +
                  "/" +
                  this.getStatus(null, res.data.d.data).totalCount,
                percentage: Math.round(score1)
              })
              this.score = Math.round((score1 + score2) / 2) + score3
              localStorage.setItem("compassScore", this.score)
              this.loading = false
              this.scoreDialog = true
            })
          // get overdue items, by using this.getStatus(item), if it returns true, add it to the count
          score1 =
            (100 * this.getStatus(null, res.data.d.data).falseCount) /
            this.getStatus(null, res.data.d.data).totalCount
          res.data.d.data.forEach((item) => {
            item.gradingItems.forEach((gradingItem, index) => {
              if (item.students[0]?.results[index]) {
                const result = item.students[0].results[index].result
                try {
                  if (
                    typeof JSON.parse(result) === "number" &&
                    JSON.parse(result) <
                    this.getGradingSchemeLength(gradingItem)
                  ) {
                    taskScore += JSON.parse(result)
                    taskScoreOutOf += this.getGradingSchemeLength(gradingItem)
                  }
                } catch (e) {
                  console.log("This is a non-numeric result.")
                }
              }
            })
          })
        }).catch(() => {
        const res = {
          data: {
            d: {
              data: [{
                students: [{
                  submissionStatus: 1,
                  results: [{
                    value: 1
                  }]
                }]
              }]
            }
          }
        }
        let taskScore = 0
        let taskScoreOutOf = 0
        let score1
        let score2
        let score3
        this.axios
          .post("/Services/ReferenceData.svc/GetTermAbsentDays", {
            userId: this.$route.params.id || this.$store.state.user?.userId,
            year: this.$date().year()
          })
          .then((resp) => {
            // get each termCount from the array of objects, and add to total
            let totalCount = 0
            resp.data.d.forEach((term) => {
              totalCount += term.termCount
            })
            if (totalCount <= 2) {
              score3 = 10
            } else if (totalCount <= 5) {
              score3 = -5
            } else if (totalCount <= 20) {
              score3 = -totalCount
            } else {
              score3 = -40
            }
            if (!taskScore) {
              taskScore = 1
            }
            if (!taskScoreOutOf) {
              taskScoreOutOf = 1
            }
            score2 = (100 * taskScore) / taskScoreOutOf
            this.inDepthResults = []
            this.inDepthResults.push({
              name: "Absence Penalty or Advantage",
              score: "N/A",
              percentage: score3
            })
            this.inDepthResults.push({
              name: "Learning Task Results",
              score: taskScore + "/" + taskScoreOutOf,
              percentage: Math.round(score2)
            })
            this.inDepthResults.push({
              name: "Learning Task Submissions",
              score:
                this.getStatus(null, res.data.d.data).falseCount +
                "/" +
                this.getStatus(null, res.data.d.data).totalCount,
              percentage: Math.round(score1)
            })
            this.score = Math.round((score1 + score2) / 2) + score3
            localStorage.setItem("compassScore", this.score)
            this.loading = false
            this.scoreDialog = true
          })
        // get overdue items, by using this.getStatus(item), if it returns true, add it to the count
        score1 =
          (100 * this.getStatus(null, res.data.d.data).falseCount) /
          this.getStatus(null, res.data.d.data).totalCount
        res.data.d.data.forEach((item) => {
          item.gradingItems.forEach((gradingItem, index) => {
            if (item.students[0]?.results[index]) {
              const result = item.students[0].results[index].result
              try {
                if (
                  typeof JSON.parse(result) === "number" &&
                  JSON.parse(result) <
                  this.getGradingSchemeLength(gradingItem)
                ) {
                  taskScore += JSON.parse(result)
                  taskScoreOutOf += this.getGradingSchemeLength(gradingItem)
                }
              } catch (e) {
                console.log("This is a non-numeric result.")
              }
            }
          })
        })
      })
    }
  },
  mounted() {
    this.getLearningSchemes()
  }
}
</script>

<style scoped></style>
