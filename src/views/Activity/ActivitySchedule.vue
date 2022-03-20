<template>
  <div>
    <v-container>
      <v-card class="rounded-xl ma-3" elevation="7">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-toolbar>
          <v-icon @click="changeDay('subtract')">mdi-arrow-left</v-icon>
          &nbsp;
          <v-icon @click="changeDay('add')">mdi-calendar</v-icon>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{ moment(focus).format("dddd, MMMM Do YYYY") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          &nbsp;
          <v-icon @click="changeDay('add')">mdi-number</v-icon>
          <v-icon @click="changeDay('add')">mdi-arrow-right</v-icon>
        </v-toolbar>
        <v-sheet   style="position: sticky">
          <!--  <vue-cal :today-button="true" :twelveHour="true" :timeStep="30"
                     :disable-views="['month', 'years', 'year']" :time="true" hide-weekends :events="computeEvents">
              <template v-slot:event="{ event }">
                <div tabindex="0" draggable="false" class="vuecal__event" style="background: transparent" :style="{backgroundColor: computeColor(event)}">
                  <div class="vuecal__event-title" v-html="event.title"></div>
                  <div class="vuecal__event-time">{{event.start.formatTime()}}<span>&nbsp;- {{event.end.formatTime()}}</span>
                  </div>
                </div>
                <div class="event-content" :style="{ backgroundColor: computeColor(event), color: computeTextColor(event) }">
                  <div class="vuecal__event-title" v-html="event.title"></div>
                  <hr/><em class="vuecal__event-time"><strong>Event start: </strong><span>{{ event.start.formatTime() }}</span><br/><strong>Event end: </strong><span>{{ event.end.formatTime() }}</span></em>
                </div>
              </template>
            </vue-cal>-->
          <!-- small chips for computeAllDayEvents -->
          <v-tabs
              fixed-tabs
          >
            <v-tab @click="type = 'week'" :active="type === 'week'" >
              Weekly Schedule
            </v-tab>
            <v-tab @click="type = 'month'" :active="type === 'month'">
              Monthly Schedule
            </v-tab>
          </v-tabs>
          <v-calendar :events="events" :type="type"
                      :first-interval="8"
                      :interval-minutes="60"
                      :interval-count="11"
                      :interval-height="60"
                      ref="calendar"
                      v-model="focus"
                      v-on:change="fetchEvents"
                      @click:event="pushEvent"
          >

          </v-calendar>
        </v-sheet>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";

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
      mode: "column",
    }
  },
  methods: {
    changeDay(type) {
      if (type === "add") {
        //this.focus = moment(this.focus).add(1, "day").format();
        this.$refs.calendar.next();
      } else if (type === "subtract") {
        //this.focus = moment(this.focus).subtract(1, "day").format();
        this.$refs.calendar.prev();
      }
    },
    pushEvent(event) {
      this.$router.push("/activity/" + event.event.instanceId);
    },
    computeColor(event) {
      if (event.activityType === 7) {
        return "red"
      } else if (event.activityType === 1) {
        return "indigo"
      } else if(event.activityType === 10) {
        return "orange"
      } else {
        return "indigo"
      }
    },
    subjectName(event) {
      const subject = this.$store.state.subjects[this.$store.state.subjects.findIndex(x => x.name === event.title)]
      if(!subject) {
        return event.longTitleWithoutTime
      } else {
        return `${subject.subjectLongName} - (${event.longTitleWithoutTime})`
      }
    },
    moment(date) {
      return moment(date);
    },
    fetchEvents() {
      this.loading = true;
      this.axios.post("/Services/Calendar.svc/GetCalendarEventsByActivity", {
        activityId: this.activity.ActivityId,
        endDate: moment(this.focus).add(this.type === "week" ? 7 : 30, "day").format("YYYY-MM-DD"),
        homePage: true,
        limit: 25,
        locationId: null,
        page: 1,
        staffIds: null,
        start: 0,
        startDate: moment(this.focus).subtract(this.type === "week" ? 7 : 30, "day").format("YYYY-MM-DD"),
        userId: this.$store.state.user?.userId || localStorage.getItem("userId"),
      }).then((res) => {
        // map events
        this.events = res.data.d.map((event) => {
          return {
            // lookup event.title in this.$store.state.subjects for name
            name: this.subjectName(event),
            content: event.longTitle,
            color: this.computeColor(event),
            start: new Date(event.start),
            end: new Date(event.finish),
            timed: !event.allDay,
            activityType: event.activityType,
            activityId: event.activityId,
            instanceId: event.instanceId,
          }
        })
        this.loading = false;
      });
    },
  },
  mounted() {
    this.fetchEvents();
  }
}
</script>

<style scoped>

</style>