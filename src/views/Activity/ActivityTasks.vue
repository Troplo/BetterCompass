<template>
  <div>
    <v-dialog v-model="upload.dialog" max-width="500px" class="rounded-xl">
      <v-card>
        <v-card-title class="headline">
          <span class="title">{{ upload.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="upload.file"
            prepend-icon="mdi-upload"
            label="File"
            color="primary"
            outlined
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="upload.dialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="uploadFile" :loading="upload.loading">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="1200px" class="rounded-xl">
      <v-card>
        <v-card-title>
          {{selectedTask.name}}
        </v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-card elevation="3" class="mb-4">
                <v-container>
                  Name: <b>{{selectedTask.name}}</b><br>
                  <template v-if="selectedTask.dueDateTimestamp">Due Date: <b>{{moment(selectedTask.dueDateTimestamp).format("dddd, MMMM Do YYYY, hh:mm A")}}</b></template><br>
                    Online Submission Enabled: <b>{{selectedTask.submissionItems.length ? "Yes" : "No"}}</b><br>
                </v-container>
              </v-card>
              <v-card elevation="3" class="mb-4">
                <v-container>
                  <html v-html="selectedTask.description || '<p>There is no task description set.</p>'"></html>
                </v-container>
              </v-card>
              <template v-if="selectedTask.attachments">
                <v-card elevation="3" v-for="attachment in selectedTask.attachments" :key="attachment.id" class="mb-4">
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-card-title>
                          {{attachment.name}}
                          <v-spacer></v-spacer>
                          <v-btn text rounded target="_blank" :href="'/Services/FileAssets.svc/DownloadFile?id=' + attachment.id + '&originalFileName=' + attachment.fileName + '&forceInstance=' + $store.state.school.instance">
                            <v-icon>
                              mdi-download
                            </v-icon>
                          </v-btn>
                        </v-card-title>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </template>
            </v-col>
            <v-col v-if="selectedTask.submissionItems">
              <v-card elevation="3" v-for="submission in selectedTask.submissionItems" :key="submission.id" class="mb-3">
                <v-toolbar :color="getSubmissionStatus(submission).color">
                  <v-toolbar-title>
                    <v-icon v-if="getSubmissionStatus(submission).status === 'pending'">
                      mdi-circle-outline
                    </v-icon>
                    <v-icon v-if="getSubmissionStatus(submission).status === 'submitted'">
                      mdi-check-circle-outline
                    </v-icon>
                    <v-icon v-if="getSubmissionStatus(submission).status === 'submittedLate'">
                      mdi-check-circle-outline
                    </v-icon>
                    <v-icon v-if="getSubmissionStatus(submission).status === 'pendingLate'">
                      mdi-alert-circle-outline
                    </v-icon>&nbsp;{{submission.name}} | {{getSubmissionStatus(submission).text}}
                  </v-toolbar-title>
                  <v-spacer>
                  </v-spacer>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          text
                          v-bind="attrs"
                          v-on="on"
                      >
                        <v-icon>
                          mdi-upload
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="upload.type = 7; upload.dialog = true">
                        <v-list-item-title>File Upload</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>URL Upload</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Upload Date
                      </th>
                      <th class="text-left">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="submission in selectedTask.students[0].submissions"
                        :key="submission.id"
                    >
                      <td style="white-space: pre-line; overflow-wrap: anywhere">{{ submission.fileName }}</td>
                      <td>{{moment(submission.timestamp).format("dddd, MMMM Do YYYY, hh:mm A")}}</td>
                      <td>
                        <v-btn text rounded target="_blank" :href="submission.fileName" v-if="submission.submissionFileType === 4">
                          <v-icon>
                            mdi-open-in-new
                          </v-icon>
                        </v-btn>
                        <v-btn text rounded target="_blank" :href="submission.fileName" v-if="submission.submissionFileType === 7">
                          <v-icon>
                            mdi-download
                          </v-icon>
                        </v-btn>
                        <v-btn text rounded target="_blank" :href="submission.fileName" v-if="submission.submissionFileType === 1">
                          <v-icon>
                            mdi-download
                          </v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

    </v-dialog>
    <v-container>
      <v-data-table
          :headers="headers"
          :items="tasks"
          :items-per-page="20"
          class="elevation-3"
          @click:row="taskDialog"
          style="cursor: pointer"
      >
        <template v-slot:item.tags="{ item }">
          <v-chip-group column>
            <v-chip color="red" v-if="item.important">
              <v-icon>mdi-alert-octagon-outline </v-icon> Important
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
          <v-icon v-if="getStatus(item).status === 'submittedLate'" color="orange">
            mdi-check-circle-outline
          </v-icon>
          <v-icon v-if="getStatus(item).status === 'pendingLate'" color="red">
            mdi-alert-circle-outline
          </v-icon>
          {{getStatus(item).text}}
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ActivityTasks",
  props: ["activity", "activityFull"],
  data() {
    return {
      tasks: [],
      dialog: false,
      upload: {
        file: null,
        loading: false,
        dialog: false,
        type: 1
      },
      page: 1,
      offset: 0,
      selectedTask:{
        "__type": "Task:http://jdlf.com.au/ns/data/learningtasks/",
        "activityId": 0,
        "activityName": "PLACEHOLDER",
        "activityStart": "2022-01-27T13:00:00Z",
        "assessmentPeriodId": null,
        "canEditResults": false,
        "canManage": false,
        "canvasIntegrationId": null,
        "categoryId": 5,
        "createdTimestamp": "2022-02-10T05:34:24Z",
        "description": "Placeholder item",
        "displayPrimaryGrading": false,
        "distributionType": 1,
        "dueDateTimestamp": null,
        "gradingItems": [],
        "groupName": "PLACEHOLDER",
        "id": 0,
        "name": "PLACEHOLDER",
        "parentCode": "PLACEHOLDER",
        "singleResultBreakdownCols": 1,
        "students": [
          {}
        ],
        "subjectName": "PLACEHOLDER",
        "submissionItems": [],
      },
      headers: [
        {
          text: 'Title',
          value: 'name',
        },
        { text: 'Tags', value: 'tags', sortable: false },
        { text: 'Status', value: 'status' }
      ],
    }
  },
  methods: {
    uploadFile() {
      this.upload.loading = true
      const formData = new FormData()
      formData.append('fileuploadfield-1504-inputEl', this.upload.file, this.upload.file.name)
      formData.append('FileUploadType', this.upload.type)
      /*         fileId: f.result.fileId || f.result.OutputFileId,
                    fileName: f.result.fileName || f.result.file,
                    resizedFileId: f.result.resizedFileId || "",
                    displayName: u,
                    schoolId: f.result.schoolId || "",
                    wikiNodeType: Compass.enums.WikiNodeType.File,*/

      this.axios.post("/Services/FileUpload/FileUploadHandler", formData).then(res => {
        this.axios.post("/Services/LearningTasks.svc/CreateTaskStudentSubmission", {
          taskStudentSubmission: {
            fileId: res.data.fileId,
            fileName: res.data.fileName,
            submissionFileType: this.upload.type,
            taskStudentId: this.selectedTask.students[0].id,
            taskSubmissionItemId: this.selectedTask.submissionItems[0].id,
          }
        }).then(() => {
          this.upload.dialog = false
          this.upload.file = null
          this.upload.type = null
          this.upload.loading = false
          this.getLearningTasks()
        })
        //fileId: "3187570e-049b-4cc9-9a0e-ba402a88ff03"
        //fileName: "ignore.txt"
        //submissionFileType: 1
        //submitterBaseRole: 1
        //taskStudentId: 542298
        //taskSubmissionItemId: 22280

        //fileId: "3187570e-049b-4cc9-9a0e-ba402a88ff03"
        //fileName: "ignore.txt"
        //message: null
        //resizedFileId: null
        //schoolId: "bhs.vic.edu.au"
        // success: true
      }).catch(error => {
        this.upload.loading = false
        console.log(error)
      })
    },
    moment(date) {
      return moment(date);
    },
    taskDialog(task) {
      this.selectedTask = task;
      this.dialog = true;
    },
    getSubmissionStatus(submission) {
      let submittedSubmission
      if(this.selectedTask.students[0].submissions?.length) {
        submittedSubmission = this.selectedTask.students[0].submissions[this.selectedTask.students[0].submissions?.findIndex(x => x.taskSubmissionItemId === submission.id)]
      }
      if(!submittedSubmission && this.selectedTask.students[0].submissionStatus === 1) {
        return {
          status:  "pending",
          text: "Pending submission",
          color: "warning"
        }
      } else if(!submittedSubmission && this.selectedTask.students[0].submissionStatus === 2) {
        return {
          status: "pendingLate",
          text: "Pending submission, overdue.",
          color: "red darken-1"
        }
      } else if(submittedSubmission && this.selectedTask.students[0].submissionStatus === 3) {
        return {
          status: "submitted",
          text: "Submitted",
          color: "success"
        }
      } else if(submittedSubmission && this.selectedTask.students[0].submissionStatus === 4) {
        return {
          status: "submittedLate",
          text: "Submitted late",
          color: "warning"
        }
      } else {
        return {
          status: "unknown",
          text: "Unknown status, please report (status: " + this.selectedTask.students[0].submissionStatus + ")"
        }
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
      this.axios.post("/Services/LearningTasks.svc/GetAllLearningTasksByActivityId", {
        activityId: this.activity.ActivityId,
        limit: 2000,
        page: this.page,
        sort: "[{\"property\":\"dueDateTimestamp\",\"direction\":\"ASC\"}]",
        start: this.offset,
      }).then((res) => {
        this.tasks = res.data.d.data;
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  created() {
    this.getLearningTasks();
  },
}
</script>

<style scoped>

</style>