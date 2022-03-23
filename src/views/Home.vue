<template>
  <div class="home" v-if="$store.state.user">
    <v-dialog v-model="taskDialog" max-width="600px">
      <v-card elevation="7">
        <v-card-title>
          <span class="headline">{{ task.editing ? "Edit" : "Add" }} Task</span>
        </v-card-title>
        <v-card-text>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-on="on"
                  v-bind="attrs">
                <v-switch
                    v-model="task.richNote"
                    inset
                    label="BetterCompass Rich Note"
                ></v-switch>
              </div>
            </template>
            <span>
            This adds additional features to your notes, but cannot be viewed properly on Compass.
          </span>
          </v-tooltip>
          <v-text-field
            v-model="task.taskName"
            label="Name"
            required
          ></v-text-field>
          <v-textarea
              v-model="task.rich.description"
              label="Description"
              v-if="task.richNote"
          ></v-textarea>
          <v-select v-model="task.rich.activityId" item-text="subjectLongName" item-value="id" v-if="task.richNote" label="Assign to Class/Subject" :items="$store.state.subjects"></v-select>
          <v-menu
              v-model="task.datePicker"
              :close-on-content-click="false"
              min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="task.dueDate"
                  label="Due Date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                color="info"
                v-model="task.dueDate"
                @input="task.datePicker = false"
            ></v-date-picker>
          </v-menu>
          <v-switch inset color="info" label="Completed" v-if="task.editing" v-model="task.status"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="taskDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="addTask(task.editing)">
            {{ task.editing ? "Update" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                  :class="type"
                  ref="calendar"
                  v-model="focus"
                  :weekdays="weekday"
                  :type="type"
                  :events="computeEvents"
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
            <v-overlay :value="loading.tasks" absolute>
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
              <v-toolbar>
                <v-btn text fab disabled></v-btn>
                <v-spacer></v-spacer>
                <v-toolbar-title>My Tasks</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn text fab @click="editTask()"><v-icon>mdi-plus</v-icon></v-btn>
              </v-toolbar>
            <v-data-table :headers="taskHeaders" :items="computeTasks" :expanded.sync="expanded" show-expand>
              <template v-slot:item.status="{ item }">
                <v-switch inset v-model="item.status" @click="setTaskStatus(item)">

                </v-switch>
              </template>
              <template v-slot:item.dueDate="{ item }">
                <span>{{item.dueDate ? moment(item.dueDate).format("dddd, MMMM Do YYYY") : "None"}}</span>
              </template>
              <template v-slot:item.tags="{ item }">
                <v-chip v-if="item.richNote">
                  Rich Note
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editTask(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" v-if="item.richNote">
                  <p style="white-space: pre-wrap;">{{item.description}}</p>
                  <template v-if="item.activityId"><b>Subject:</b> {{$store.state.subjects[$store.state.subjects.findIndex(x => x.id === item.activityId)].subjectLongName || "Unknown"}}</template>
                </td>
                <td :colspan="headers.length" v-else>
                  <span>Only rich notes are expandable.</span>
                </td>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
              <v-toolbar>
                <v-spacer></v-spacer>
                <v-toolbar-title>Upcoming Events</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            <v-container>
              <v-card
                  v-for="item in $store.state.upcomingEvents"
                  :key="item.id"
                  class="rounded-xl mx-2 ma-3"
                  dense
                  elevation="3"
                  text
              >
                <v-container>
                  <router-link style="text-decoration: none" to="/user/events">{{item.LinkText}}</router-link><br>
                  <small>{{item.Body}}</small>
                </v-container>
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
                        :href="attachment.UiLink + '&forceInstance=' + $store.state.school.instance"
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
          <v-card
              :class="scrollbarTheme"
              class="rounded-xl ma-3 text-center justify-center"
              elevation="7"
              v-if="weather.name"
          >
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                Weather
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  {{weather.name}}
                </v-list-item-title>
                <v-list-item-subtitle>{{ moment().format("dddd, MMMM Do YYYY") }}, {{weather.weather[0].main}}: {{weather.weather[0].description}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col
                    class="text-h2"
                >
                  {{ weather.main.temp }}&deg;C
                </v-col>
              </v-row>
              <small>Feels like: {{weather.main.feels_like}}&deg;C</small>
            </v-card-text>

            <v-list-item>
              <v-list-item-subtitle>
                {{weather.wind.speed}} km/h wind speed</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-subtitle>
                {{ weather.main.humidity }}% humidity</v-list-item-subtitle>
            </v-list-item>
          </v-card>
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>What's new in BetterCompass?</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <v-card-title>
                23/03/2022
              </v-card-title>
              <ul>
                <li>Tasks, you can now, create, view, and edit normal Compass tasks.</li>
                <li>Rich Notes, rich notes are an enhanced version of standard tasks that allow you to add descriptions, they cannot be viewed in normal Compass.</li>
                <li>Class Notes, using rich notes, you can now create notes that are specific to a class. </li>
                <li>You can now see your upcoming events on the dashboard.</li>
                <li>You can now minimize header activities to only show learning tasks and your current school week (if your school supports it), enable in BetterCompass Settings.</li>
                <li>Removed redundant day text and button from calendar on the daily schedule mode.</li>
                <li>You can now download attachments from School News.</li>
                <li>Lesson plans are now sanitized to avoid XSS (albeit an extremely unlikely occurrence), and other uglifying styles.</li>
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
      expanded: [],
      taskHeaders: [
        {
          text: "Completed",
          value: "status"
        },
        {
          text: "Title",
          value: "taskName"
        },
        {
          text: "Due Date",
          value: "dueDate"
        },
        {
          text: "Tags",
          value: "tags"
        },
        {
          text: "Actions",
          value: "actions"
        },
        {
          text: "Expand",
          value: "data-table-expand"
        }
      ],
      tab: 0,
      taskDialog: false,
      task: {
        richNote: false,
        rich: {
          description: "",
          activityId: 0
        },
        datePicker: false,
        taskName: "",
        dueDate: null,
        priority: "normal",
        status: false,
        id: 0
      },
      loading: {
        calendar: true,
        tasks: true
      },
      learningTaskAlert: false,
      tasks: [],
      type: 'day',
      mode: 'stack',
      alerts: [],
      overDueLearningTasks: 0,
      weekday: [1, 2, 3, 4, 5],
      value: '',
      events: [],
      focus: moment().format(),
      news: [],
      user: {},
      weather: {}
    }
  },
  computed: {
    computeTasks() {
      let tasks = [];
      this.tasks.forEach(task => {
        let richNote
        try {
          richNote = JSON.parse(task.taskName)
        } catch {
          richNote = false
        }
        if(richNote) {
          tasks.push({
            richNote: richNote.richNote,
            richNoteVersion: richNote.richNoteVersion,
            taskName: richNote?.taskName,
            description: richNote?.description,
            activityId: richNote?.activityId,
            dueDate: task.dueDate,
            status: richNote?.status,
            id: task.id
          });
        } else {
          tasks.push(task);
        }
      });
      return tasks;
    },
    computeEvents() {
      if(this.$store.state.settings.minimizeHeaderEvents) {
        // only show timed events, or events that have a color of #003300
        return this.events.filter(event => {
          return event.timed || event.color === '#003300' || event.color === "#FFBB5B"
        });
      } else {
        return this.events
      }
    },
    scrollbarTheme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  methods: {
    editTask(task) {
      if(task) {
        this.task = {
          richNote: task.richNote,
          rich: {
            description: task.description,
            activityId: task.activityId
          },
          editing: true,
          taskName: task.taskName,
          dueDate: moment(task.dueDate).format("YYYY-MM-DD"),
          id: task.id,
          status: task.status,
        }
        this.taskDialog = true
      } else {
        this.task = {
          richNote: false,
          rich: {
            description: "",
            activityId: 0
          },
          editing: false,
          taskName: "",
          dueDate: null,
          id: 0,
          status: false
        }
        this.taskDialog = true
      }
    },
    addTask(edit) {
      const route = edit ? "UpdateTaskItem" : "SaveTaskItem"
      const date = this.task.dueDate === "Invalid date" ? null : this.task.dueDate
      if(!this.task.richNote) {
        this.axios.post("/Services/TaskService.svc/" + route, {
          task: {
            taskName: this.task.taskName,
            dueDate: date,
            status: this.task.status,
            id: this.task.id
          }
        }).then(() => {
          this.task = {
            richNote: false,
            rich: {
              description: "",
              activityId: 0
            },
            datePicker: false,
            taskName: "",
            dueDate: null,
            priority: "normal",
            status: false,
            id: 0
          }
          this.taskDialog = false;
          this.getTasks();
        })
      } else {
        this.axios.post("/Services/TaskService.svc/" + route, {
          task: {
            datePicker: false,
            taskName: JSON.stringify({
              n: "DO NOT EDIT MANUALLY, This is a BetterCompass rich note, please use BetterCompass to view and edit this note.",
              richNote: this.task.richNote,
              richNoteVersion: 1,
              description: this.task.rich.description,
              activityId: this.task.rich.activityId,
              taskName: this.task.taskName,
              dueDate: date,
              status: this.task.status
            }),
            dueDate: date,
            status: false,
            id: this.task.id
          }
        }).then(() => {
          this.task = {
            richNote: false,
            rich: {
              description: "",
              activityId: 0
            },
            datePicker: false,
            taskName: "",
            dueDate: null,
            priority: "normal",
            status: false,
            id: 0
          }
          this.taskDialog = false;
          this.getTasks();
        })
      }
    },
    setTaskStatus(task) {
      const date = task.dueDate === "Invalid date" ? null : this.task.dueDate
      this.loading.tasks = true
      if(!task.richNote) {
        this.axios.post("/Services/TaskService.svc/UpdateTaskItem", {
          task
        }).then(() => {
          this.loading.tasks = false
          this.getTasks()
        }).catch(() => {
          this.loading.tasks = false
          this.$toast.error("Failed to update task status.");
        });
      } else {
        this.axios.post("/Services/TaskService.svc/UpdateTaskItem", {
          task: {
            datePicker: false,
            taskName: JSON.stringify({
              n: "DO NOT EDIT MANUALLY, This is a BetterCompass rich note, please use BetterCompass to view and edit this note.",
              richNote: task.richNote,
              richNoteVersion: task.richNoteVersion,
              description: task.description,
              activityId: task.activityId,
              taskName: task.taskName,
              dueDate: date,
              status: task.status
            }),
            dueDate: date,
            status: task.status,
            id: task.id
          }
        }).then(() => {
          this.loading.tasks = false
          this.getTasks()
        }).catch(() => {
          this.loading.tasks = false
          this.$toast.error("Failed to update task status.");
        });
      }
    },
    getTasks() {
      this.loading.tasks = true
      this.axios.post("/Services/TaskService.svc/GetTaskItems", {
        limit: 25,
        page: 1,
        start: 0
      }).then((res) => {
        this.loading.tasks = false
        this.tasks = res.data.d
      })
    },
    getWeather() {
      if(this.$store.state.settings.weather) {
        this.axios.get("/api/v1/weather").then(res => {
          this.weather = res.data;
        })
      }
    },
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
      })
    },
    pushEvent(event) {
      this.$router.push("/activity/" + event.event.instanceId);
    },
    computeColor(event) {
      if(event.color === "#003300") {
        return "success"
      } else if (event.activityType === 7 || event.color === "#f4dcdc") {
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
    this.getTasks()
    this.getWeather()
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
