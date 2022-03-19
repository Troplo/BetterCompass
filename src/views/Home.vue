<template>
  <div class="home" v-if="$store.state.user">
    <v-container>
      <v-row>
        <v-col xl="6">
          <v-alert
              dismissible
              elevation="5"
              class="rounded-xl ma-3"
              type="info"
          >
            Link your parent account to BetterCompass to get additional features.
          </v-alert>
          <v-alert
              dismissible
              v-model="learningTaskAlert"
              elevation="5"
              class="rounded-xl ma-3"
              type="warning"
          >
            4 overdue learning tasks.
          </v-alert>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-overlay :value="loading.calendar" absolute>
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
                <v-tab @click="type = 'day'" :active="type === 'day'">
                  Daily Schedule
                </v-tab>
                <v-tab @click="type = 'week'" :active="type === 'week'">
                  Weekly Schedule
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
          <v-card class="rounded-xl ma-3" elevation="7" v-if="!$vuetify.breakpoint.xl">
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
        </v-col>
        <v-col v-if="$vuetify.breakpoint.xl">
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
      loading: {
        calendar: true,
      },
      type: 'day',
      types: ['month', 'week', 'day', '4day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      learningTaskAlert: true,
      alerts: [],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      categories: ["1"],
      focus: moment().format(),
      news: [],
      user: {}
    }
  },
  methods: {
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
            color: this.computeColor(event),
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
    this.$store.dispatch("getUserInfo").then((res) => {
      this.user = res
      this.fetchEvents();
      this.getNews()
      this.getAlerts()
    })
  },
  watch: {
    type() {
      this.fetchEvents();
    }
  }
}
</script>
