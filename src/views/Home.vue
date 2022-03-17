<template>
  <div class="home" v-if="$store.state.user">
    <v-container>
      <v-row>
        <v-col>
          <v-card class="rounded-xl ma-3 d-flex flex-column" elevation="7">
            <v-toolbar>
              <v-icon @click="changeDay('subtract')">mdi-arrow-left</v-icon>
              <v-spacer></v-spacer>
              <v-toolbar-title>{{ moment(focus).format("dddd, MMMM Do YYYY") }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="changeDay('add')">mdi-arrow-right</v-icon>
            </v-toolbar>
            <v-sheet height="500">
              <v-calendar
                  ref="calendar"
                  :events="computeEvents"
                  v-model="focus"
                  type="day"
                  hide-header
                  :event-margin-bottom=10
                  color="blue"
                  :first-time="computeFirstTime()"
                  :interval-count="computeIntervalCount()"
                  :event-color="computeColor"
              ></v-calendar>
            </v-sheet>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-container>
              asd
            </v-container>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-container>
              asd
            </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>School News</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card
                v-for="item in news"
                :key="item.id"
                class="rounded-xl mx-2 ma-3"
                dense
                elevation="6"
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
                  <div class="text-block" style="white-space: pre-line">
                    {{ item.Content1 }}
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
  data() {
    return {
      events: [],
      categories: ["1"],
      focus: moment().format(),
      news: [],
      user: {}
    }
  },
  computed: {
    computeEvents() {
      return this.events.filter(event => !event.allDay);
    },
  },
  methods: {
    computeIntervalCount() {
      return this.computeEvents.length + 2
    },
    computeFirstTime() {
      if(this.computeEvents.length > 0) {
        return moment(this.computeEvents[0].start).subtract(3, "hour").startOf("hour").format("HH:mm A");
      }
    },
    computeColor(event) {
      if(event.activityType === 7) {
        return "red"
      } else if(event.activityType === 1) {
        return "blue"
      }
    },
    changeDay(type) {
      if(type === "add") {
        this.focus = moment(this.focus).add(1, "day").format();
      } else if(type === "subtract") {
        this.focus = moment(this.focus).subtract(1, "day").format();
      }
    },
    moment(date) {
      return moment(date);
    },
    fetchEvents() {
      this.axios.post("/Services/Calendar.svc/GetCalendarEventsByUser", {
        activityId: null,
        endDate: moment(this.focus).format("YYYY-MM-DD"),
        homePage: true,
        limit: 25,
        locationId: null,
        page: 1,
        staffIds: null,
        start: 0,
        startDate: moment(this.focus).format("YYYY-MM-DD"),
        userId: this.user.userId
      }).then((res) => {
        // map events
        this.events = res.data.d.map((event) => {
          return {
            name: event.longTitleWithoutTime,
            start: moment(event.start).format("YYYY-MM-DD HH:mm"),
            end: moment(event.finish).format("YYYY-MM-DD HH:mm"),
            allDay: event.allDay,
            activityType: event.activityType
          }
        })
      });
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
    })
  },
  watch: {
    focus() {
      this.fetchEvents();
    }
  }
}
</script>
