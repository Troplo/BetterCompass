<template>
  <div>
    <v-dialog v-model="taskDialog" max-width="600px">
      <v-card color="card" elevation="7">
        <v-card-title>
          <span class="headline">{{ task.editing ? "Edit" : "Add" }} Task</span>
        </v-card-title>
        <v-card-text>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-on="on" v-bind="attrs">
                <v-switch
                  v-model="task.richNote"
                  inset
                  disabled
                  label="BetterCompass Rich Note"
                ></v-switch>
              </div>
            </template>
            <span>
              This adds additional features to your notes, but cannot be viewed
              properly on Compass.
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
          <v-select
            v-model="task.rich.activityId"
            disabled
            item-text="subjectLongName"
            item-value="id"
            v-if="task.richNote"
            label="Assign to Class/Subject"
            :items="$store.state.subjects"
          ></v-select>
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
          <v-switch
            inset
            color="info"
            label="Completed"
            v-if="task.editing"
            v-model="task.status"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="taskDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="addTask(task.editing)">
            {{ task.editing ? "Save" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-select
        class="mx-5"
        outlined
        dense
        v-model="selectedActivity"
        :items="activityFull.Instances"
        item-value="id"
        append-outer-icon="mdi-arrow-right"
        prepend-icon="mdi-arrow-left"
        @click:append-outer="pushEvent(null, 'forward')"
        @click:prepend="pushEvent(null, 'back')"
        item-text="dt"
        label="Activity Instances"
        @change="pushEvent"
      >
        <template v-slot:item="{ item }">
          <span v-html="item.dt"></span>&nbsp;
          <v-spacer></v-spacer>
          <v-btn
            text
            v-if="new Date(item.fn) < new Date()"
            color="red"
            outlined
            small
            >Previous Session</v-btn
          >
          <v-btn
            text
            v-if="new Date(item.fn) > new Date()"
            color="success"
            outlined
            small
            >Upcoming Session</v-btn
          >
        </template>
      </v-select>
      <v-card color="card" class="rounded-xl ma-3" elevation="7">
        <v-container>
          <v-row>
            <v-col>
              <h3>Teacher</h3>
              <h1>
                <router-link
                  :to="'/user/' + activity.managers[0].ManagerUserId"
                  style="text-decoration: none; color: inherit"
                >
                  <v-avatar large class="mr-3">
                    <img :src="getTeacherPhoto" /> </v-avatar
                  >{{ activity.ManagerTextReadable }}
                </router-link>
              </h1>
            </v-col>
            <v-col>
              <h3>Location</h3>
              <h1>{{ activity.LocationDetails.longName }}</h1>
            </v-col>
            <v-col>
              <h3>Seats</h3>
              <h1>{{ activity.LocationDetails.seatNumber }}</h1>
            </v-col>
            <v-col>
              <h3>Computers</h3>
              <h1>{{ activity.LocationDetails.computerNumber }}</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-row>
        <v-col sm="7">
          <v-card color="card" class="rounded-xl ma-3" elevation="7">
            <v-toolbar color="toolbar">
              <v-spacer></v-spacer>
              <v-toolbar-title>Lesson Plan</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <html v-html="cleanLessonPlan"></html>
            </v-container>
          </v-card>
        </v-col>
        <v-col style="white-space: pre-line; overflow-wrap: anywhere" sm="5">
          <v-card color="card" class="rounded-xl ma-3" elevation="7">
            <v-overlay :value="loading.tasks" absolute>
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
            <v-toolbar color="toolbar">
              <v-btn text fab disabled></v-btn>
              <v-spacer></v-spacer>
              <v-toolbar-title>Personal Class Tasks/Notes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text fab @click="editTask()"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-toolbar>
            <v-data-table
              :headers="taskHeaders"
              :items="computeTasks"
              :expanded.sync="expanded"
              show-expand
              :style="
                'background-color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .card
              "
            >
              <template v-slot:item.status="{ item }">
                <v-switch
                  inset
                  v-model="item.status"
                  @click="setTaskStatus(item)"
                >
                </v-switch>
              </template>
              <template v-slot:item.dueDate="{ item }">
                <span>{{
                  item.dueDate
                    ? dayjs(item.dueDate).format("dddd, MMMM Do YYYY")
                    : "None"
                }}</span>
              </template>
              <template v-slot:item.tags="{ item }">
                <v-chip v-if="item.richNote"> Rich Note </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editTask(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" v-if="item.richNote">
                  <p style="white-space: pre-wrap">{{ item.description }}</p>
                  <b>Subject:</b>
                  {{
                    $store.state.subjects[
                      $store.state.subjects.findIndex(
                        (x) => x.id === item.activityId
                      )
                    ]?.subjectLongName || item.activityId + " (Unknown Activity)"
                  }}
                </td>
                <td :colspan="headers.length" v-else>
                  <span>Only rich notes are expandable.</span>
                </td>
              </template>
            </v-data-table>
          </v-card>
          <v-card color="card" class="rounded-xl ma-3" elevation="7">
            <v-toolbar color="toolbar">
              <v-spacer></v-spacer>
              <v-toolbar-title>Class News</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <v-card color="card" v-for="item in news" :key="item.id">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      <v-avatar large left>
                        <img
                          :src="
                            item.UserImageUrl +
                            '?compassInstance=' +
                            $store.state.school.instance
                          "
                        /> </v-avatar
                      >&nbsp;
                      {{ item.UserName }}
                    </v-list-item-title>
                    <v-list-item-title class="text-h6">
                      {{ item.Title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      $date(item.PostDateTime).format(
                        "hh:mm A, dddd, MMMM Do YYYY"
                      )
                    }}</v-list-item-subtitle
                    ><br />
                    <p
                      style="
                        white-space: pre-line !important;
                        overflow-wrap: anywhere !important;
                        display: inline-block;
                      "
                      v-html="item.Content1"
                    ></p>
                    <v-chip
                      v-for="download in item.Attachments"
                      :key="download.id"
                      color="indigo"
                      :href="
                        download.UiLink +
                        '&compassInstance=' +
                        $store.state.school.instance
                      "
                    >
                      <v-icon>mdi-download</v-icon>
                      {{ download.Name }}
                    </v-chip>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  name: "ActivityDashboard",
  props: {
    activity: {},
    activityFull: {},
    resources: {},
    news: {},
    lessonPlan: {},
    getActivity: {
      type: Function,
      default: () => {}
    }
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
      taskDialog: false,
      task: {
        richNote: true,
        rich: {
          description: ""
        },
        datePicker: false,
        taskName: "",
        dueDate: null,
        priority: "normal",
        status: false,
        id: 0
      },
      loading: {
        tasks: true
      },
      tasks: [],
      lp: "<p>No lesson plan has been uploaded yet.</p>"
    }
  },
  computed: {
    cleanLessonPlan() {
      return this.$sanitize(this.lessonPlan)
    },
    computeTasks() {
      let tasks = []
      this.tasks.forEach((task) => {
        let richNote
        try {
          richNote = JSON.parse(task.taskName)
        } catch {
          richNote = false
        }
        if (richNote) {
          if (richNote.activityId === JSON.parse(this.activity.ActivityId)) {
            tasks.push({
              richNote: richNote.richNote,
              richNoteVersion: richNote.richNoteVersion,
              taskName: richNote?.taskName,
              description: richNote?.description,
              activityId: richNote?.activityId,
              dueDate: task.dueDate,
              status: richNote?.status,
              id: task.id
            })
          }
        }
      })
      return tasks
    },
    getTeacherPhoto() {
      if (this.activity.managers[0].CoveringPhotoPath) {
        return (
          this.activity.managers[0].CoveringPhotoPath.replace(
            "full",
            "square"
          ) +
          "?compassInstance=" +
          this.$store.state.school.instance
        )
      } else {
        return (
          this.activity.managers[0].ManagerPhotoPath.replace("full", "square") +
          "?compassInstance=" +
          this.$store.state.school.instance
        )
      }
    },
    selectedActivity: {
      get() {
        return this.activity.id
      },
      set() {}
    }
  },
  methods: {
    editTask(task) {
      if (task) {
        this.task = {
          richNote: task.richNote,
          rich: {
            description: task.description,
            activityId: task.activityId
          },
          editing: true,
          taskName: task.taskName,
          dueDate: null,
          id: task.id,
          status: task.status
        }
        this.taskDialog = true
      } else {
        this.task = {
          richNote: true,
          rich: {
            description: "",
            activityId: JSON.parse(this.activity.ActivityId)
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
      if (!this.task.richNote) {
        this.axios
          .post("/Services/TaskService.svc/" + route, {
            task: this.task
          })
          .then(() => {
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
            this.taskDialog = false
            this.getTasks()
          })
      } else {
        this.axios
          .post("/Services/TaskService.svc/" + route, {
            task: {
              datePicker: false,
              taskName: JSON.stringify({
                n: "DO NOT EDIT MANUALLY, This is a BetterCompass rich note, please use BetterCompass to view and edit this note.",
                richNote: this.task.richNote,
                richNoteVersion: 1,
                description: this.task.rich.description,
                activityId: this.task.rich.activityId,
                taskName: this.task.taskName,
                dueDate: this.task.dueDate,
                pinned: this.task.rich.pinned,
                status: this.task.status
              }),
              dueDate: this.task.dueDate,
              status: false,
              id: this.task.id
            }
          })
          .then(() => {
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
            this.taskDialog = false
            this.getTasks()
          })
      }
    },
    setTaskStatus(task) {
      const date = task.dueDate === "Invalid date" ? null : this.task.dueDate
      this.loading.tasks = true
      if (!task.richNote) {
        this.axios
          .post("/Services/TaskService.svc/UpdateTaskItem", {
            task
          })
          .then(() => {
            this.loading.tasks = false
            this.getTasks()
          })
          .catch(() => {
            this.loading.tasks = false
            this.$toast.error("Failed to update task status.")
          })
      } else {
        this.axios
          .post("/Services/TaskService.svc/UpdateTaskItem", {
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
          })
          .then(() => {
            this.loading.tasks = false
            this.getTasks()
          })
          .catch(() => {
            this.loading.tasks = false
            this.$toast.error("Failed to update task status.")
          })
      }
    },
    getTasks() {
      this.loading.tasks = true
      this.axios
        .post("/Services/TaskService.svc/GetTaskItems", {
          limit: 99999,
          page: 1,
          start: 0
        })
        .then((res) => {
          this.loading.tasks = false
          this.tasks = res.data.d
        })
    },
    dayjs(date) {
      return dayjs(date)
    },
    pushEvent(event, auto) {
      if (auto === "forward") {
        const eventObject =
          this.activityFull.Instances[
            this.activityFull.Instances.findIndex(
              (x) => x.id === this.activity.id
            ) + 1
          ]
        this.$router.push("/activity/" + eventObject.id)
        this.getActivity(eventObject.id)
      } else if (auto === "back") {
        const eventObject =
          this.activityFull.Instances[
            this.activityFull.Instances.findIndex(
              (x) => x.id === this.activity.id
            ) - 1
          ]
        this.$router.push("/activity/" + eventObject.id)
        this.getActivity(eventObject.id)
      } else {
        this.$router.push("/activity/" + event)
        this.getActivity(event)
      }
    }
  },
  mounted() {
    this.getTasks()
    this.selectedActivity = this.activity.id
  }
}
</script>

<style scoped></style>
