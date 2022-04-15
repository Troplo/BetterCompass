<template>
  <div>
    <v-dialog v-model="upload.dialog" max-width="500px" class="rounded-xl">
      <v-card color="card">
        <v-card-title class="headline">
          <span class="title">{{ upload.title }}</span>
        </v-card-title>
        <v-card-text v-if="upload.type !== 4">
          <v-file-input
            v-model="upload.file"
            prepend-icon="mdi-upload"
            label="File"
            color="primary"
            outlined
          ></v-file-input>
        </v-card-text>
        <v-card-text v-if="upload.type === 4">
          <v-text-field
            label="URL Link"
            v-model="upload.file"
            prepend-icon="mdi-link"
            color="primary"
            outlined
            placeholder="https://google.com"
            @keyup.enter="uploadFile"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="upload.dialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            text
            @click="uploadFile"
            :loading="upload.loading"
            >Upload</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="1200px" class="rounded-xl">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            {{selectedTask.name}}
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-tabs background-color="card">
            <v-tab> Details </v-tab>
            <v-tab> Feedback </v-tab>
            <v-tab v-if="selectedTask.rubric"> Rubric </v-tab>
            <v-tab-item
              :style="
                'background-color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .card
              "
            >
              <v-row>
                <v-col>
                  <v-card color="card" elevation="3" class="ma-2">
                    <v-container>
                      Name: <b>{{ selectedTask.name }}</b
                      ><br />
                      Creation Date: <b>{{$date(selectedTask.createdTimestamp).format("dddd, MMMM Do YYYY, hh:mm A")}}</b><br>
                      <template v-if="selectedTask.dueDateTimestamp"
                        >Due Date:
                        <b>{{selectedTask.dueDateTimestamp}}</b></template
                      ><br />
                      Online Submission Enabled:
                      <b>{{ selectedTask.submissionItems ? "Yes" : "No" }}</b
                      ><br />
                    </v-container>
                  </v-card>
                  <v-card color="card" elevation="3" class="ma-2">
                    <v-container>
                      <html
                        v-html="
                          cleanLessonPlan ||
                          '<p>There is no task description set.</p>'
                        "
                      ></html>
                    </v-container>
                  </v-card>
                  <template v-if="selectedTask.attachments">
                    <v-card
                      color="card"
                      elevation="3"
                      v-for="attachment in selectedTask.attachments"
                      :key="attachment.id"
                      class="ma-2"
                    >
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-card-title>
                              {{ attachment.name }}
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                rounded
                                target="_blank"
                                :href="
                                  '/Services/FileAssets.svc/DownloadFile?id=' +
                                  attachment.id +
                                  '&originalFileName=' +
                                  attachment.fileName +
                                  '&compassInstance=' +
                                  $store.state.school.instance
                                "
                              >
                                <v-icon> mdi-download </v-icon>
                              </v-btn>
                            </v-card-title>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </template>
                </v-col>
                <v-col v-if="selectedTask.submissionItems">
                  <v-card
                    color="card"
                    elevation="3"
                    v-for="submission in selectedTask.submissionItems"
                    :key="submission.id"
                    class="ma-2"
                  >
                    <v-toolbar :color="getSubmissionStatus(submission).color">
                      <v-toolbar-title>
                        <v-icon
                          v-if="
                            getSubmissionStatus(submission).status === 'pending'
                          "
                        >
                          mdi-circle-outline
                        </v-icon>
                        <v-icon
                          v-if="
                            getSubmissionStatus(submission).status ===
                            'submitted'
                          "
                        >
                          mdi-check-circle-outline
                        </v-icon>
                        <v-icon
                          v-if="
                            getSubmissionStatus(submission).status ===
                            'submittedLate'
                          "
                        >
                          mdi-check-circle-outline
                        </v-icon>
                        <v-icon
                          v-if="
                            getSubmissionStatus(submission).status ===
                            'pendingLate'
                          "
                        >
                          mdi-alert-circle-outline </v-icon
                        >&nbsp;{{ submission.name }} |
                        {{ getSubmissionStatus(submission).text }}
                      </v-toolbar-title>
                      <v-spacer> </v-spacer>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn text v-bind="attrs" v-on="on">
                            <v-icon> mdi-upload </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            @click="
                              upload.type = 7
                              upload.dialog = true
                            "
                          >
                            <v-list-item-title>File Upload</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="
                              upload.type = 4
                              upload.dialog = true
                            "
                          >
                            <v-list-item-title>URL Upload</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-toolbar>
                    <v-simple-table
                      :style="
                        'background-color: ' +
                        $vuetify.theme.themes[
                          $vuetify.theme.dark ? 'dark' : 'light'
                        ].card
                      "
                    >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Upload Date</th>
                            <th class="text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="userSubmission in selectedTask.students[0]
                              .submissions"
                            :key="userSubmission.id"
                          >
                            <template
                              v-if="
                                userSubmission.taskSubmissionItemId ===
                                submission.id
                              "
                            >
                              <td
                                style="
                                  white-space: pre-line;
                                  overflow-wrap: anywhere;
                                "
                              >
                                {{ userSubmission.fileName }}
                              </td>
                              <td>
                                {{
                                  $date(userSubmission.timestamp).format(
                                    "dddd, MMMM Do YYYY, hh:mm A"
                                  )
                                }}
                              </td>
                              <td>
                                <v-card-actions>
                                  <v-btn
                                    text
                                    fab
                                    small
                                    rounded
                                    target="_blank"
                                    :href="userSubmission.fileName"
                                    v-if="
                                      userSubmission.submissionFileType === 4
                                    "
                                  >
                                    <v-icon> mdi-open-in-new </v-icon>
                                  </v-btn>
                                  <v-btn
                                    text
                                    fab
                                    small
                                    rounded
                                    :href="
                                      '/Services/FileAssets.svc/DownloadFile?id=' +
                                      userSubmission.fileId +
                                      '&originalFileName=' +
                                      userSubmission.fileName +
                                      '&compassInstance=' +
                                      $store.state.school.instance
                                    "
                                    v-if="
                                      userSubmission.submissionFileType === 7
                                    "
                                  >
                                    <v-icon> mdi-download </v-icon>
                                  </v-btn>
                                  <v-btn
                                    text
                                    fab
                                    small
                                    rounded
                                    :href="
                                      '/Services/FileAssets.svc/DownloadFile?id=' +
                                      userSubmission.fileId +
                                      '&originalFileName=' +
                                      userSubmission.fileName +
                                      '&compassInstance=' +
                                      $store.state.school.instance
                                    "
                                    v-if="
                                      userSubmission.submissionFileType === 1
                                    "
                                  >
                                    <v-icon> mdi-download </v-icon>
                                  </v-btn>
                                  <v-btn
                                    v-if="false"
                                    text
                                    fab
                                    small
                                    rounded
                                    @click="deleteSubmission(userSubmission)"
                                  >
                                    <v-icon> mdi-delete </v-icon>
                                  </v-btn>
                                </v-card-actions>
                              </td>
                            </template>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item
              :style="
                'background-color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .card
              "
            >
              <v-row>
                <v-col
                  sm="7"
                  v-if="selectedTask.gradingItems.length || selectedTask.rubric"
                >
                  <v-card
                    color="card"
                    elevation="3"
                    class="ma-2 rounded-xl"
                    v-if="selectedTask.gradingItems.length"
                  >
                    <v-toolbar color="toolbar">
                      <v-toolbar-title> Grading Items </v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                      <v-card-text>
                        Any assessment results provided below are raw scores and
                        may change during school or state based statistical
                        assessment moderation. The statistical, state based,
                        moderation process is used to ensure that schools’
                        assessments are comparable throughout the state. It
                        involves adjusting each schools’ coursework scores for
                        that study to match the level and spread of the combined
                        examination and GAT scores for the students in that
                        school doing that study. For more information on
                        assessment moderation, please contact the school.
                      </v-card-text>
                      <v-simple-table
                        :style="
                          'background-color: ' +
                          $vuetify.theme.themes[
                            $vuetify.theme.dark ? 'dark' : 'light'
                          ].card
                        "
                      >
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(
                                gradingItem, index
                              ) in selectedTask.gradingItems"
                              :key="gradingItem.id"
                            >
                              <td
                                style="
                                  white-space: pre-line;
                                  overflow-wrap: anywhere;
                                "
                              >
                                {{ gradingItem.name }}
                              </td>
                              <td>
                                {{
                                  getGradingScheme(
                                    gradingItem,
                                    selectedTask.students[0].results[index]
                                      .result
                                  )
                                }}
                                <template
                                  v-if="
                                    getGradingSchemeLength(gradingItem) <= 1
                                  "
                                >
                                  {{
                                    selectedTask.students[0].results[index]
                                      .result
                                  }}
                                </template>
                                <template v-else>
                                  ({{
                                    selectedTask.students[0].results[index]
                                      .result
                                  }}/{{ getGradingSchemeLength(gradingItem) }})
                                </template>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card color="card" class="ma-2 rounded-xl">
                    <v-toolbar color="toolbar">
                      <v-toolbar-title> Feedback Chat </v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                      <v-card
                        color="card"
                        class="mt-2"
                        v-for="feedback in selectedTask.students[0].comments"
                        :key="feedback.id"
                      >
                        <v-container>
                          <v-list-item-title>
                            <b>{{ feedback.userNamePoster }}</b>
                          </v-list-item-title>
                          <v-list-item-content>
                            {{ feedback.comment }}
                          </v-list-item-content>
                          <small>{{
                            $date(feedback.timestamp).format(
                              "dddd, MMMM Do YYYY"
                            )
                          }}</small>
                        </v-container>
                      </v-card>
                      <v-text-field
                        v-model="newFeedback"
                        label="Send Response"
                        placeholder="I wanted to let you know that..."
                        append-outer-icon="mdi-send"
                        @click:append-outer="sendFeedback"
                      >
                      </v-text-field>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item
              v-if="selectedTask.rubric"
              :style="
                'background-color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .card
              "
            >
              <v-card
                color="card"
                elevation="3"
                class="ma-2 rounded-xl"
                v-if="selectedTask.rubric"
              >
                <v-toolbar color="toolbar">
                  <v-toolbar-title> Rubric </v-toolbar-title>
                </v-toolbar>
                <v-container>
                  <v-data-table
                    :headers="rubricHeaders"
                    :items="rubricItems"
                    :items-per-page="$store.state.user.bcUser.rowsPerPage"
                    @update:items-per-page="updateRows"
                    style="white-space: pre-wrap"
                    class="elevation-1"
                    :style="
                      'background-color: ' +
                      $vuetify.theme.themes[
                        $vuetify.theme.dark ? 'dark' : 'light'
                      ].card
                    "
                  >
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.name">
                          <td>
                            <b>{{ item.criteria }}</b>
                          </td>
                          <td
                            v-for="entity in removeCriteria(item)"
                            :key="entity.id"
                          >
                            <template>
                              <span
                                v-for="content in entity"
                                :key="content.description"
                                :class="{
                                  rubricGranted: rubricGranted(content)
                                }"
                              >
                                &bullet;&nbsp;{{ content.description
                                }}<br /><br />
                              </span>
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-container>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title> Learning Tasks </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-on="on" v-bind="attrs">
                <v-checkbox
                  v-model="hideIrrelevantTasks"
                  hide-details
                  single-line
                  label="Hide Irrelevant Tasks"
                  color="primary"
                >
                </v-checkbox>
              </div>
            </template>
            <span>
              Will hide overdue/pending tasks older than 10 weeks, and submitted
              tasks older than 2 weeks
            </span>
          </v-tooltip>
        </v-toolbar>
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-data-table
          :headers="headers"
          :items="computeTasks"
          :items-per-page="$store.state.user.bcUser.rowsPerPage"
          @update:items-per-page="updateRows"
          class="elevation-3"
          @click:row="taskDialog"
          style="cursor: pointer"
          :style="
            'background-color: ' +
            $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
          "
        >
          <template v-slot:item.tags="{ item }">
            <v-chip-group column>
              <v-chip color="red" v-if="item.important">
                <v-icon>mdi-alert-octagon-outline </v-icon> Important
              </v-chip>
              <v-chip color="blue" v-if="item.rubricWikiNodeIds">
                <v-icon>mdi-format-list-bulleted </v-icon> Rubric
              </v-chip>
              <v-chip v-if="getCategory(item)" :color="getCategory(item).color">
                {{ getCategory(item).categoryName }}
              </v-chip>
            </v-chip-group>
          </template>
          <template v-slot:item.status="{ item }">
            <v-icon v-if="getStatus(item).status === 'pending'">
              mdi-circle-outline
            </v-icon>
            <v-icon v-if="getStatus(item).status === 'submitted'" color="green">
              mdi-check-circle-outline
            </v-icon>
            <v-icon
              v-if="getStatus(item).status === 'submittedLate'"
              color="orange"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-icon v-if="getStatus(item).status === 'pendingLate'" color="red">
              mdi-alert-circle-outline
            </v-icon>
            {{ getStatus(item).text }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  name: "ActivityTasks",
  props: ["activity", "activityFull"],
  data() {
    return {
      hideIrrelevantTasks: false,
      newFeedback: "",
      loading: false,
      tasks: [],
      dialog: false,
      gradingSchemes: [],
      categories: [],
      upload: {
        file: null,
        loading: false,
        dialog: false,
        type: 1
      },
      page: 1,
      offset: 0,
      rubricItems: [],
      rubricHeaders: [
        {
          text: "Criteria",
          value: "criteria",
          width: "13%",
          sortable: false
        }
      ],
      selectedTask: {
        __type: "Task:http://jdlf.com.au/ns/data/learningtasks/",
        activityId: 0,
        activityName: "PLACEHOLDER",
        activityStart: "2022-01-27T13:00:00Z",
        assessmentPeriodId: null,
        canEditResults: false,
        canManage: false,
        canvasIntegrationId: null,
        categoryId: 5,
        createdTimestamp: "2022-02-10T05:34:24Z",
        description: "Placeholder item",
        displayPrimaryGrading: false,
        distributionType: 1,
        dueDateTimestamp: null,
        gradingItems: [],
        groupName: "PLACEHOLDER",
        id: 0,
        name: "PLACEHOLDER",
        parentCode: "PLACEHOLDER",
        singleResultBreakdownCols: 1,
        students: [{}],
        subjectName: "PLACEHOLDER",
        submissionItems: []
      },
      headers: [
        {
          text: "Title",
          value: "name"
        },
        { text: "Tags", value: "tags", sortable: false },
        { text: "Due Date", value: "dueDateTimestamp" },
        { text: "Status", value: "status" }
      ]
    }
  },
  computed: {
    computeTasks() {
      if (this.hideIrrelevantTasks) {
        return this.tasks.filter(
          (task) =>
            (task.createdTimestamp > dayjs().subtract(2, "week").format() &&
              this.getStatusBoolean(task)) ||
            (task.createdTimestamp > dayjs().subtract(10, "week").format() &&
              !this.getStatusBoolean(task))
        )
      } else {
        return this.tasks
      }
    },
    cleanLessonPlan() {
      return this.$sanitize(this.selectedTask.description)
    }
  },
  methods: {
    getStatusBoolean(item) {
      if (item.students[0].submissionStatus === 1) {
        return false
      } else if (item.students[0].submissionStatus === 2) {
        return false
      } else if (item.students[0].submissionStatus === 3) {
        return true
      } else return item.students[0].submissionStatus === 4
    },
    updateRows(val) {
      this.$store.dispatch("saveOnlineSettings", {
        rowsPerPage: val
      })
    },
    getCategory(item) {
      const category = this.categories.find(
        (category) => category.categoryId === item.categoryId
      )
      if (category) {
        const colors = ["green", "indigo", "orange", "blue", "red"]
        return {
          color: colors[category.categoryId - 1],
          ...category
        }
      } else {
        return null
      }
    },
    rubricGranted(content) {
      const result = this.selectedTask.students[0].rubricResults.find(
        (result) => result.rubricGradingScaleId === content.gradingScaleId
      )
      return !!result
    },
    removeCriteria(items) {
      delete items.criteria
      return items
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
    sendFeedback() {
      this.selectedTask.loading = true
      this.axios
        .post("/Services/LearningTasks.svc/CreateTaskStudentComment", {
          taskId: this.selectedTask.id,
          taskStudentComment: {
            taskStudentId: this.selectedTask.students[0].id,
            comment: this.newFeedback
          }
        })
        .then((res) => {
          this.selectedTask.students[0].comments.push(res.data)
          this.selectedTask.loading = false
          this.newFeedback = ""
        })
    },
    deleteSubmission(submission) {
      this.axios
        .post("/Services/LearningTasks.svc/DeleteTaskStudentSubmission", {
          learningTaskId: this.selectedTask.id,
          taskStudentSubmissionId: submission.id
        })
        .then(() => {
          this.getLearningTasks()
        })
        .catch(() => {
          this.$toast.error("You do not have permission to do this action.")
        })
    },
    uploadFile() {
      if (!this.selectedTask.students[0].submissions) {
        this.selectedTask.students[0].submissions = []
      }
      this.upload.loading = true
      if (this.upload.type === 4) {
        this.axios
          .post("/Services/FileAssets.svc/UploadSubmissionUrlWithPost", {
            addressString: this.upload.file
          })
          .then((res) => {
            this.axios
              .post("/Services/LearningTasks.svc/CreateTaskStudentSubmission", {
                taskStudentSubmission: {
                  // look at this inconsistency! res.data.d when its just res.data for the regular file uploads API
                  fileId: res.data.d.fileId,
                  fileName: res.data.d.fileName,
                  submissionFileType: this.upload.type,
                  taskStudentId: this.selectedTask.students[0].id,
                  taskSubmissionItemId: this.selectedTask.submissionItems[0].id
                }
              })
              .then((res1) => {
                this.upload.dialog = false
                this.upload.file = null
                this.upload.type = null
                this.upload.loading = false
                this.selectedTask.students[0].submissions.push({
                  id: res1.data.d,
                  fileId: res.data.d.fileId,
                  fileName: res.data.d.fileName,
                  submissionFileType: this.upload.type,
                  taskStudentId: this.selectedTask.students[0].id,
                  taskSubmissionItemId: this.selectedTask.submissionItems[0].id,
                  timestamp: this.$date().format()
                })
                this.getLearningTasks()
              })
          })
      } else {
        const formData = new FormData()
        formData.append(
          "fileuploadfield-1504-inputEl",
          this.upload.file,
          this.upload.file.name
        )
        formData.append("FileUploadType", this.upload.type)

        this.axios
          .post("/Services/FileUpload/FileUploadHandler", formData)
          .then((res) => {
            this.axios
              .post("/Services/LearningTasks.svc/CreateTaskStudentSubmission", {
                taskStudentSubmission: {
                  fileId: res.data.fileId,
                  fileName: res.data.fileName,
                  submissionFileType: this.upload.type,
                  taskStudentId: this.selectedTask.students[0].id,
                  taskSubmissionItemId: this.selectedTask.submissionItems[0].id
                }
              })
              .then((res1) => {
                this.upload.dialog = false
                this.upload.file = null
                this.upload.type = null
                this.upload.loading = false
                this.selectedTask.students[0].submissions.push({
                  id: res1.data.d,
                  fileId: res.data.fileId,
                  fileName: res.data.fileName,
                  submissionFileType: this.upload.type,
                  taskStudentId: this.selectedTask.students[0].id,
                  taskSubmissionItemId: this.selectedTask.submissionItems[0].id,
                  timestamp: this.$date().format()
                })
                this.getLearningTasks()
              })
          })
          .catch((error) => {
            this.upload.loading = false
            console.log(error)
          })
      }
    },
    dayjs(date) {
      return dayjs(date)
    },
    taskDialog(task) {
      this.selectedTask = null
      this.selectedTask = task
      this.selectedTask.loading = false
      this.rubricHeaders = [
        {
          text: "Criteria",
          value: "criteria",
          width: "13%",
          sortable: false
        }
      ]
      this.rubricItems = []
      // only supports single rubric for now, no lesson plan for multiple available.
      if (task.rubricWikiNodeIds) {
        this.loading = true
        this.axios
          .post("/Services/Rubrics.svc/GetRubric", {
            id: null,
            wikiNodeId: task.rubricWikiNodeIds[0]
          })
          .then((res) => {
            this.loading = false
            this.selectedTask.rubric = res.data.d
            this.rubricItems = res.data.d.criteria.map((item) => {
              let object = {
                criteria: item.name
              }
              item.gradingScales.forEach((scale) => {
                object[scale.name] = scale.contentDescriptors.map(
                  (descriptor) => {
                    return descriptor
                  }
                )
              })
              return object
            })
            this.rubricHeaders.push(
              ...this.selectedTask.rubric.criteria[0].gradingScales.map(
                (item) => {
                  return {
                    text: item.name,
                    value: "value-" + item.ordinal,
                    sortable: false
                  }
                }
              )
            )
            this.dialog = true
          })
      } else {
        this.dialog = true
      }
    },
    getSubmissionStatus(submission) {
      let submittedSubmission
      if (this.selectedTask.students[0].submissions?.length) {
        submittedSubmission =
          this.selectedTask.students[0].submissions[
            this.selectedTask.students[0].submissions?.findIndex(
              (x) => x.taskSubmissionItemId === submission.id
            )
          ]
      }
      if (
        !submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 1
      ) {
        return {
          status: "pending",
          text: "Pending submission",
          color: "warning"
        }
      } else if (
        !submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 2
      ) {
        return {
          status: "pendingLate",
          text: "Pending submission, overdue.",
          color: "red darken-1"
        }
      } else if (
        submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 1
      ) {
        return {
          status: "submitted",
          text: "Submitted",
          color: "success"
        }
      } else if (
        submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 2
      ) {
        return {
          status: "submitted",
          text: "Submitted",
          color: "success"
        }
      } else if (
        submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 3
      ) {
        return {
          status: "submitted",
          text: "Submitted",
          color: "success"
        }
      } else if (
        submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 4
      ) {
        return {
          status: "submittedLate",
          text: "Submitted late",
          color: "warning"
        }
      } else if (
        !submittedSubmission &&
        this.selectedTask.students[0].submissionStatus === 3
      ) {
        return {
          status: "submitted",
          text: "Marked as Submitted",
          color: "success"
        }
      } else {
        return {
          status: "unknown",
          text:
            "Unknown status, please report (status: " +
            this.selectedTask.students[0].submissionStatus +
            ")"
        }
      }
    },
    getStatus(item) {
      if (item.students[0].submissionStatus === 1) {
        return {
          status: "pending",
          text: "Pending submission"
        }
      } else if (item.students[0].submissionStatus === 2) {
        return {
          status: "pendingLate",
          text: "Pending submission, overdue."
        }
      } else if (item.students[0].submissionStatus === 3) {
        return {
          status: "submitted",
          text: "Submitted"
        }
      } else if (item.students[0].submissionStatus === 4) {
        return {
          status: "submittedLate",
          text: "Submitted late"
        }
      } else {
        return {
          status: "unknown",
          text:
            "Unknown status, please report (status: " +
            item.students[0].submissionStatus +
            ")"
        }
      }
    },
    getLearningSchemes() {
      this.axios
        .get(
          "/Services/ReferenceDataCache.svc/GetGradingSchemesForLearningTasks"
        )
        .then((res) => {
          this.gradingSchemes = res.data.d
        })
    },
    getCategories() {
      this.axios
        .post("/Services/LearningTasks.svc/GetAllTaskCategories", {
          start: 0
        })
        .then((res) => {
          this.categories = res.data.d
        })
    },
    getLearningTasks() {
      this.loading = true
      this.axios
        .post("/Services/LearningTasks.svc/GetAllLearningTasksByActivityId", {
          activityId: this.activity.ActivityId,
          limit: 2000,
          page: this.page,
          sort: '[{"property":"dueDateTimestamp","direction":"ASC"}]',
          start: this.offset
        })
        .then((res) => {
          this.loading = false
          this.tasks = res.data.d.data.map((item) => {
            return {
              ...item,
              dueDateTimestamp: item.dueDateTimestamp
                ? this.$date(item.dueDateTimestamp).format(
                    "hh:mm A, dddd, MMMM Do YYYY"
                  )
                : "No due date"
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.getLearningSchemes()
    this.getLearningTasks()
    this.getCategories()
    this.hideIrrelevantTasks = this.$store.state.user.bcUser?.hideIrrelevantTasks
  },
  watch: {
    "$store.state.user.bcUser"() {
      this.hideIrrelevantTasks = this.$store.state.user.bcUser?.hideIrrelevantTasks
    },
    hideIrrelevantTasks(value) {
      this.$store.dispatch("saveOnlineSettings", {
        hideIrrelevantTasks: value
      })
    }
  }
}
</script>

<style scoped>
.rubricGranted {
  color: #66bb6a;
}
.v-simple-table > .v-data-table__wrapper > table > thead > tr > th,
td {
  min-width: 150px !important;
}
</style>
