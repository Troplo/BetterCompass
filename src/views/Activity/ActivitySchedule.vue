<template>
  <div>
    <v-container>
      <v-card color="card" class="rounded-xl mb-3" elevation="7">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-toolbar color="toolbar">
          <v-icon @click="changeDay('subtract')">mdi-arrow-left</v-icon>
          &nbsp;
          <v-icon @click="changeDay('add')">mdi-calendar</v-icon>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{
            $date(focus).format("dddd, MMMM Do YYYY")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          &nbsp;
          <v-icon @click="changeDay('add')">mdi-number</v-icon>
          <v-icon @click="changeDay('add')">mdi-arrow-right</v-icon>
        </v-toolbar>
        <v-sheet color="sheet" style="position: sticky">
          <v-tabs background-color="card" fixed-tabs>
            <v-tab @click="type = 'week'" :active="type === 'week'">
              Weekly Schedule
            </v-tab>
            <v-tab @click="type = 'month'" :active="type === 'month'">
              Monthly Schedule
            </v-tab>
          </v-tabs>
          <v-calendar
            :events="events"
            :type="type"
            :first-interval="8"
            :interval-minutes="60"
            :interval-count="11"
            :interval-height="60"
            ref="calendar"
            v-model="focus"
            v-on:change="fetchEvents"
            @click:event="pushEvent"
            :style="
              'background-color: ' +
              $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
            "
          >
          </v-calendar>
        </v-sheet>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  name: "ActivitySchedule",
  props: ["activity"],
  data() {
    return {
      loading: true,
      focus: new Date(),
      events: [],
      type: "week",
      weekday: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      mode: "column"
    }
  },
  methods: {
    changeDay(type) {
      if (type === "add") {
        //this.focus = dayjs(this.focus).add(1, "day").format();
        this.$refs.calendar.next()
      } else if (type === "subtract") {
        //this.focus = dayjs(this.focus).subtract(1, "day").format();
        this.$refs.calendar.prev()
      }
    },
    pushEvent(event) {
      this.$router.push("/activity/" + event.event.instanceId)
    },
    computeColor(event) {
      if (event.color === "#003300") {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarActivityType8
      } else if (event.activityType === 7 || event.color === "#f4dcdc") {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarActivityType7
      } else if (event.color === "#dce6f4") {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarNormalActivity
      } else if (event.activityType === 10) {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarActivityType10
      } else {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarNormalActivity
      }
    },
    subjectName(event) {
      const subject =
        this.$store.state.subjects[
          this.$store.state.subjects.findIndex((x) => x.name === event.title)
        ]
      if (!subject) {
        return event.longTitleWithoutTime
      } else {
        return `${subject.subjectLongName} - (${event.longTitleWithoutTime})`
      }
    },
    fetchEvents() {
      this.loading = true
      this.axios
        .post("/Services/Calendar.svc/GetCalendarEventsByActivity", {
          activityId: this.activity.ActivityId,
          endDate: dayjs(this.focus)
            .add(this.type === "week" ? 7 : 30, "day")
            .format("YYYY-MM-DD"),
          homePage: true,
          limit: 25,
          locationId: null,
          page: 1,
          staffIds: null,
          start: 0,
          startDate: dayjs(this.focus)
            .subtract(this.type === "week" ? 7 : 30, "day")
            .format("YYYY-MM-DD"),
          userId:
            this.$store.state.user?.userId || localStorage.getItem("userId")
        })
        .then((res) => {
          this.events = res.data.d.map((event) => {
            return {
              name: this.subjectName(event),
              content: event.longTitle,
              color: this.computeColor(event),
              start: new Date(event.start),
              end: new Date(event.finish),
              timed: !event.allDay,
              activityType: event.activityType,
              activityId: event.activityId,
              instanceId: event.instanceId
            }
          })
          this.loading = false
        })
    }
  },
  mounted() {
    this.fetchEvents()
  }
}
</script>

<style scoped></style>
