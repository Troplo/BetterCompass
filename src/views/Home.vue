<template>
  <div class="home" v-if="$store.state.user">
    <v-container>
      <v-row>
        <v-col xl="6">
          <!--<v-alert
              dismissible
              elevation="5"
              class="rounded-xl ma-3"
              type="info"
          >
            Link your parent account to BetterCompass to get additional features.
          </v-alert>-->
          <v-alert
              dismissible
              v-model="learningTaskAlert"
              elevation="5"
              class="rounded-xl ma-3"
              type="warning"
          >
            {{overDueLearningTasks}} overdue learning tasks.
          </v-alert>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-overlay :value="loading.calendar" absolute>
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-toolbar>
              <v-btn text small fab @click="changeDay('subtract')">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              &nbsp;
              <v-menu
                  ref="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on }">
                  <v-btn text small fab v-on="on">
                    <v-icon>mdi-calendar</v-icon>
                  </v-btn>
                </template>
                <v-date-picker
                    v-model="focus"
                    no-title
                    scrollable
                    color="info"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(focus)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-spacer></v-spacer>
              <v-toolbar-title>{{ moment(focus).format("dddd, MMMM Do YYYY") }}</v-toolbar-title>
              <v-spacer></v-spacer>
              &nbsp;
              <v-btn text small fab @click="focus = moment().toISOString(); fetchEvents()">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn text small fab @click="changeDay('add')">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-toolbar>
            <v-sheet   style="position: sticky">
              <v-tabs
                  fixed-tabs
                  v-model="tab"
              >
                <v-tab @click="type = 'day'" value="day">
                  Daily Schedule
                </v-tab>
                <v-tab @click="type = 'week'" value="week">
                  Weekly Schedule
                </v-tab>
                <v-tab @click="type = 'month'" value="month" v-if="false">
                  Monthly Schedule
                </v-tab>
              </v-tabs>
              <v-calendar
                  ref="calendar"
                  v-model="focus"
                  :weekdays="weekday"
                  :type="type"
                  :events="events"
                  :event-overlap-mode="mode"
                  :event-overlap-threshold="30"
                  :first-interval="8"
                  :interval-minutes="60"
                  :interval-count="11"
                  :interval-height="60"
                  :event-color="computeColor"
                  @change="fetchEvents"
                  @click:event="pushEvent"
              >
              </v-calendar>
            </v-sheet>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
              <v-toolbar>
                <v-spacer></v-spacer>
                <v-toolbar-title>My Tasks</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
              <v-toolbar>
                <v-spacer></v-spacer>
                <v-toolbar-title>Looking Ahead</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            <v-container>
              <v-card
                  v-for="item in news"
                  :key="item.id"
                  class="rounded-xl mx-2 ma-3"
                  dense
                  elevation="3"
                  text
              >
              </v-card>
            </v-container>
          </v-card>
      </v-col>
        <v-col>
          <v-alert v-for="alert in alerts" :key="alert.id" type="info" class="rounded-xl ma-3">
            {{ alert.Body }}
          </v-alert>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>{{ $store.state.school.name }} News</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card
                v-for="item in news"
                :key="item.id"
                class="rounded-xl mx-2 ma-3"
                dense
                elevation="3"
                text
            >
              <v-container class="text-center align-center justify-center">
                <div>
                  <v-avatar
                      :src="$store.state.school.fqdn + item.UserImageUrl"
                      align="center"
                      class="text-center justify-center"
                      justify="center"
                      size="40"
                  >
                    <img
                        :src="$store.state.school.fqdn + item.UserImageUrl"
                    />
                  </v-avatar>
                  <p class="text-h5">
                    {{ item.UserName }}
                  </p>
                  <div class="text-block" style="white-space: pre-line" v-html="item.Content1">
                  </div>
                  <v-card-actions class="justify-center">
                    <v-chip
                        v-for="attachment in item.Attachments"
                        :key="attachment.id"
                        :href="attachment.Url"
                        download
                        color="indigo"
                        dark
                    >
                      <v-icon>mdi-download</v-icon>
                      {{ attachment.Name }}
                    </v-chip>
                  </v-card-actions>

                  <small>{{
                      moment(item.PostDateTime).format("dddd, MMMM Do YYYY, hh:mm A")
                    }}</small>
                </div>
              </v-container>
            </v-card>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>What's new in BetterCompass?</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <ul>
                <li>Fixed the dark sidebar on light theme.</li>
                <li>Removed white border around calendar.</li>
                <li>Added calendar refresh button (which also jumps to today).</li>
                <li>Added feedback tab to learning tasks.</li>
                <li>Compass links in learning tasks will be replaced with BetterCompass equivalents.</li>
                <li>Weekly schedule will exclude weekends.</li>
                <li>"Your Profile" now won't crash if you load it as the initial route.</li>
                <li>Learning task uploader now properly supports 2 or more upload types.</li>
                <li>Extra chronicle info has been moved to a dialog.</li>
                <li>The QuickSwitcher now clears the input automatically.</li>
                <li>The PWA app has been modified so the title-bar matches the background.</li>
                <li>The calendar now recognizes substitute teacher classes.</li>
                <li>You can now see what teacher you have on the activity.</li>
                <li>The activity instance will now automatically set itself upon QuickSwitch.</li>
                <li>You can now easily change between activity instances with arrows.</li>
              </ul>
              <small>BetterCompass version {{$store.state.versioning.version}}, built on {{$store.state.versioning.date}}</small>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      tab: 0,
      loading: {
        calendar: true,
      },
      learningTaskAlert: false,
      type: 'day',
      mode: 'stack',
      alerts: [],
      overDueLearningTasks: 0,
      weekday: [1, 2, 3, 4, 5],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      focus: moment().format(),
      news: [],
      user: {}
    }
  },
  methods: {
    getStatus(item) {
      if(item.students[0].submissionStatus === 1) {
        return {
          status: "pending",
          text: "Pending submission"
        }
      } else if(item.students[0].submissionStatus === 2) {
        return {
          status: "pendingLate",
          text: "Pending submission, overdue."
        }
      } else if(item.students[0].submissionStatus === 3) {
        return {
          status: "submitted",
          text: "Submitted"
        }
      } else if(item.students[0].submissionStatus === 4) {
        return {
          status: "submittedLate",
          text: "Submitted late"
        }
      } else {
        return {
          status: "unknown",
          text: "Unknown status, please report (status: " + item.students[0].submissionStatus + ")"
        }
      }
    },
    getLearningTasks() {
      this.axios.post("/Services/LearningTasks.svc/GetAllLearningTasksByUserId", {
        forceTaskId: 0,
        limit: 2000,
        page: 1,
        sort: "[{\"property\":\"dueDateTimestamp\",\"direction\":\"ASC\"}]",
        start: 0,
        showHiddenTasks: true,
        userId: this.$store.state.user.userId
      }).then((res) => {
        res.data.d.data.forEach((item) => {
          if (this.getStatus(item).status === "pendingLate") {
            this.overDueLearningTasks++
          }
        })
        if(this.overDueLearningTasks > 0 && this.$store.state.settings.learningTaskNotification) {
          this.learningTaskAlert = true
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    pushEvent(event) {
      this.$router.push("/activity/" + event.event.instanceId);
    },
    computeTextColor(event) {
      const color = this.computeColor(event)
      const r = parseInt(color.substr(0,2),16);
      const g = parseInt(color.substr(2,2),16);
      const b = parseInt(color.substr(4,2),16);
      const yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? 'black' : 'white';
      },
    computeIntervalCount() {
      return this.computeEvents.length + 2
    },
    computeFirstTime() {
      if (this.computeEvents.length > 0) {
        return moment(this.computeEvents[0].start).subtract(3, "hour").startOf("hour").format("HH:mm A");
      }
    },
    computeColor(event) {
      if (event.activityType === 7 || event.color === "#f4dcdc") {
        return "red"
      } else if (event.color === "#dce6f4") {
        return "indigo"
      } else if(event.activityType === 10) {
        return "orange"
      } else {
        return "indigo"
      }
    },
    changeDay(type) {
      if (type === "add") {
        //this.focus = moment(this.focus).add(1, "day").format();
        this.$refs.calendar.next();
      } else if (type === "subtract") {
        //this.focus = moment(this.focus).subtract(1, "day").format();
        this.$refs.calendar.prev();
      }
    },
    moment(date) {
      return moment(date);
    },
    subjectName(event) {
      const subject = this.$store.state.subjects[this.$store.state.subjects.findIndex(x => x.name === event.title)]
      if(!subject) {
        return event.longTitleWithoutTime
      } else {
        return `${subject.subjectLongName} - (${event.longTitleWithoutTime})`
      }
    },
    fetchEvents() {
      this.loading.calendar = true;
      this.axios.post("/Services/Calendar.svc/GetCalendarEventsByUser", {
        activityId: null,
        endDate: moment(this.focus).add(this.type === "day" ? 0 : 6, "day").format("YYYY-MM-DD"),
        homePage: true,
        limit: 25,
        locationId: null,
        page: 1,
        staffIds: null,
        start: 0,
        startDate: moment(this.focus).subtract(this.type === "day" ? 0 : 6, "day").format("YYYY-MM-DD"),
        userId: this.$store.state.user?.userId || localStorage.getItem("userId")
      }).then((res) => {
        // map events
        this.events = res.data.d.map((event) => {
          return {
            // lookup event.title in this.$store.state.subjects for name
            name: this.subjectName(event),
            content: event.longTitle,
            color: event.backgroundColor,
            start: new Date(event.start),
            end: new Date(event.finish),
            timed: !event.allDay,
            activityType: event.activityType,
            activityId: event.activityId,
            instanceId: event.instanceId,
          }
        })
        this.loading.calendar = false;
      });
    },
    getAlerts() {
      this.axios.post("/Services/NewsFeed.svc/GetMyAlerts").then((res) => {
        this.alerts = res.data.d
      })
    },
    getNews() {
      this.axios.post("/Services/NewsFeed.svc/GetMyNewsFeedPaged", {
        limit: 10,
        start: 0
      }).then((res) => {
        this.news = res.data.d.data
      })
    }
  },
  mounted() {
    if(!localStorage.getItem("calendarType")) {
      localStorage.setItem("calendarType", "day")
    }
    this.type = localStorage.getItem("calendarType") || "day";
    this.tab = localStorage.getItem("calendarType") === "day" ? 0 : 1;
    this.$store.dispatch("getUserInfo").then((res) => {
      this.user = res
      this.fetchEvents();
      this.getNews()
      this.getAlerts()
      this.getLearningTasks()
    })
  },
  watch: {
    type() {
      this.fetchEvents();
      localStorage.setItem("calendarType", this.type);
    },
    learningTaskAlert() {
      if(!this.learningTaskAlert) {
        const settings = {
          learningTaskNotification: false,
          dark: this.$store.state.settings.dark
        }
        localStorage.setItem('settings', JSON.stringify(settings))
      }
    }
  }
}
</script>
