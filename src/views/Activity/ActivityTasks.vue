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
              <v-card elevation="3">
                <v-container>
                  Name: <b>{{selectedTask.name}}</b><br>
                  <template v-if="selectedTask.dueDateTimestamp">Due Date: <b>{{moment(selectedTask.dueDateTimestamp).format("dddd, MMMM Do YYYY, hh:mm A")}}</b></template><br>
                    Online Submission Enabled: <b>{{selectedTask.submissionItems.length ? "Yes" : "No"}}</b><br>
                </v-container>
              </v-card>
              <br>
              <v-card elevation="3">
                <v-container>
                  <html v-html="selectedTask.description || '<p>There is no task description set.</p>'"></html>
                </v-container>
              </v-card>
            </v-col>
            <v-col>
              <v-card elevation="3" v-for="submission in selectedTask.submissionItems" :key="submission.id" class="mb-3">
                <v-toolbar :color="getSubmissionStatus(submission).color">
                  <v-toolbar-title>
                    {{submission.name}} | {{getSubmissionStatus(submission).text}}
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
      dialog: true,
      upload: {
        file: null,
        loading: false,
        dialog: false,
        type: 1
      },
      page: 1,
      offset: 0,
      selectedTask: {"__type":"Task:http://jdlf.com.au/ns/data/learningtasks/","activityId":48601,"activityName":"10ENG16","activityStart":"2022-01-27T13:00:00Z","assessmentPeriodId":null,"attachments":[{"__type":"TaskAttachment:http://jdlf.com.au/ns/data/learningtasks/","contentUrl":null,"fileName":"CAT - SELFISH PARENTS SHUN SAFETY.docx","id":"e4cf05f9-9026-448e-aa70-20009665f37e","name":"CAT - SELFISH PARENTS SHUN SAFETY","wikiNodeId":232859,"wikiNodeType":3},{"__type":"TaskAttachment:http://jdlf.com.au/ns/data/learningtasks/","contentUrl":null,"fileName":"CAT-analysis scaffold.docx","id":"9c353f8e-eccd-4b82-a539-556b8b57e9e7","name":"CAT-analysis scaffold","wikiNodeId":232860,"wikiNodeType":3},{"__type":"TaskAttachment:http://jdlf.com.au/ns/data/learningtasks/","contentUrl":null,"fileName":"instructions and template.doc.docx","id":"0f2d15cf-ede9-430a-a22e-dd3cf1f85a66","name":"instructions and template.doc","wikiNodeId":232861,"wikiNodeType":3}],"canEditResults":false,"canManage":false,"canvasIntegrationId":null,"categoryId":5,"createdTimestamp":"2022-02-10T05:34:24Z","description":"<strong><u>CAT instructions:</u></strong><br />\n1. Carefully read and annotate the attached article,&nbsp;<strong>Selfish Parents Shun Safety.&nbsp;</strong><br />\n2. Complete the analysis scaffold handout.<br />\n3.&nbsp;Write your practice essay using the attached template as a guide to help you.&nbsp;Make sure&nbsp;<br />\n&nbsp; &nbsp; &nbsp;your&nbsp;essay has an introduction, at least 3 body paragraphs, and a conclusion.<br />\n4. <strong>You must upload your practice essay/CFA2 to receive feedback prior to writing up your final copy, CAT.</strong>","displayPrimaryGrading":false,"distributionType":1,"dueDateTimestamp":null,"gradingItems":[{"__type":"TaskGradingItem:http://jdlf.com.au/ns/data/learningtasks/","calculationSettings":null,"calculationType":null,"canvasIntegrationId":null,"category":null,"commentLength":null,"commentType":1,"decimalPlaces":null,"dimension":null,"gradingItemOrderBy":0,"id":89590,"includeInCrossSubjectSummaryReport":false,"includeInSemesterReport":false,"includedCalculationCycleMeasures":[],"irishSubjectCode":null,"isAggregateItem":false,"isContributingItem":false,"isPrimaryGrade":false,"isSelfAssessment":false,"isSystemScheme":false,"max":"","measureUniqueId":"CommentBank","min":"","name":"Comment (Open)","ordinal":1,"parentStudentAccess":1,"progressGraphItemType":0,"reportIncludeDistribution":false,"reportOrdinal":1,"reportRenderType":0,"shortName":"","staffAccess":1,"strandCode":null,"taskId":28564,"tempId":null,"weighting":0}],"groupName":"10ENG16","hidden":false,"id":28564,"important":false,"includeBreakdownHeading":false,"includeInOverall":false,"includeInSemesterReports":false,"isAggregateTask":false,"isContributingTask":false,"name":"Term 1 CFA 2 & CAT Language Analysis 2022","parentCode":"10ENG16","promptForCycleOnPush":false,"reportDisplayType":1,"reportOrdinal":null,"resultDistributionDisplayType":1,"rubricItems":null,"rubricWikiNodeIds":[232862],"securityOptions":[{"__type":"TaskSecurityOption:http://jdlf.com.au/ns/data/learningtasks/","allowSubmission":false,"enableCommentChain":false,"gradingVisible":false,"taskVisible":true,"userBaseRole":3},{"__type":"TaskSecurityOption:http://jdlf.com.au/ns/data/learningtasks/","allowSubmission":false,"enableCommentChain":true,"gradingVisible":true,"taskVisible":true,"userBaseRole":2},{"__type":"TaskSecurityOption:http://jdlf.com.au/ns/data/learningtasks/","allowSubmission":true,"enableCommentChain":true,"gradingVisible":false,"taskVisible":true,"userBaseRole":1}],"semesterReportCycles":null,"sendSmsOutstanding":false,"showAverageBoxPlot":true,"showLegendBoxPlot":true,"showTaskDueDates":false,"singleResultBreakdownCols":1,"students":[{"__type":"TaskStudent:http://jdlf.com.au/ns/data/learningtasks/","comments":null,"dueDateTimestamp":"","id":546104,"lastSubmittedTimestamp":"","primaryResult":null,"results":[],"rubricResults":null,"selfAssessmentEnabled":false,"smsOutstandingSentTimestamp":"","submissionStatus":1,"submissions":null,"submittedTimestamp":"","taskId":28564,"teacherResponses":null,"userId":5090,"userName":"Matthew NICHOLS"}],"subjectId":null,"subjectName":"10 YR 10 ENGLISH","submissionItems":[{"__type":"TaskSubmissionItem:http://jdlf.com.au/ns/data/learningtasks/","id":22414,"name":"Universal","taskId":28564,"type":2}],"taskReportDescription":"","taskTitleOnReport":"Term 1 CAT Language Analysis","verticalBreakdownHeadings":false,"wikiNodeId":232858},
      headers: [
        {
          text: 'Title',
          value: 'name',
        },
        { text: 'Tags', value: 'tags', sortable: false },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions' },
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
          color: "danger"
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