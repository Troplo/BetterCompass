<template>
  <div class="home" v-if="$store.state.user">
    <v-dialog v-model="calendarDialog" max-width="1800px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-btn
            text
            small
            fab
            @click="changeDay('subtract')"
            v-shortkey="['d']"
          >
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
              v-model="$store.state.focus"
              @click:date="fetchEvents(false, true)"
              no-title
              scrollable
              color="info"
            >
            </v-date-picker>
          </v-menu>
          <v-btn text small fab disabled> </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{
            $date($store.state.focus).format("dddd, MMMM Do YYYY")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          &nbsp;
          <v-btn text small fab @click="calendarDialog = false">
            <v-icon>mdi-arrow-collapse-all</v-icon>
          </v-btn>
          <v-btn
            text
            small
            fab
            @click="
              $store.state.focus = $date().format()
              fetchEvents(false, true)
            "
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <button
            style="display: none"
            v-shortkey="['arrowleft']"
            @shortkey="changeDay('subtract')"
          ></button>
          <button
            style="display: none"
            v-shortkey="['arrowright']"
            @shortkey="changeDay('add')"
          ></button>
          <v-btn text small fab @click="changeDay('add')">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-overlay :value="loading.calendar" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <v-card
            color="card"
            style="position: sticky"
            :style="
              'background-color: ' +
              $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
            "
          >
            <v-tabs background-color="card" fixed-tabs v-model="tab">
              <v-tab
                @click="type = 'day'"
                value="day"
                :style="
                  'background-color: ' +
                  $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                    .card
                "
              >
                Daily Schedule
              </v-tab>
              <v-tab
                @click="type = 'week'"
                value="week"
                :style="
                  'background-color: ' +
                  $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                    .card
                "
              >
                Weekly Schedule
              </v-tab>
            </v-tabs>
            <v-calendar
              :style="
                'background-color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .card
              "
              :class="type"
              ref="calendar-dialog"
              v-model="$store.state.focus"
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
              @click:event="pushEvent"
            >
            </v-calendar>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
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
        <v-card-title>
          {{ selectedTask.name }}
        </v-card-title>
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
                      <template v-if="selectedTask.dueDateTimestamp"
                        >Due Date:
                        <b>{{
                          $date(selectedTask.dueDateTimestamp).format(
                            "dddd, MMMM Do YYYY, hh:mm A"
                          )
                        }}</b></template
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
                    :items-per-page="$store.state.bcUser.rowsPerPage"
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
            {{ task.editing ? "Update" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card
        color="card ma-3"
        class="rounded-xl"
        v-if="$store.state.editMode === 'editing'"
      >
        <v-toolbar color="toolbar lighten-3">
          <v-toolbar-title>Add Widgets</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-btn
            text
            v-for="item in computedItems"
            :key="item.id"
            @click="addWidget(item)"
          >
            {{ item.friendlyName }}
          </v-btn>
          <v-divider class="ma-2"></v-divider>
          <v-btn @click="addGrid()" text :disabled="grids.length >= 3">
            Add Grid
          </v-btn>
          <v-btn @click="restoreDefaults()" text> Restore Defaults </v-btn>
        </v-container>
      </v-card>
      <v-row>
        <v-col v-for="(grid, index) in grids" :key="index">
          <v-toolbar
            color="toolbar lighten-2"
            class="rounded-xl ma-3"
            v-if="$store.state.editMode === 'editing'"
          >
            <v-toolbar-title> Grid {{ index + 1 }} </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="removeGrid(index)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <draggable
            v-model="grid.items"
            :sort="true"
            group="home"
            :options="{ disabled: $store.state.editMode !== 'editing' }"
          >
            <div v-for="item in grid.items" :key="item.id">
              <v-card
                class="rounded-xl ma-3"
                elevation="7"
                color="card"
                v-if="$store.state.editMode === 'editing'"
              >
                <v-toolbar color="toolbar lighten-1">
                  <v-toolbar-title>
                    {{ item.friendlyName }}
                    <template v-if="item.invisible">
                      <v-icon color="grey--text" class="ml-2"
                        >mdi-eye-off</v-icon
                      >
                    </template>
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="removeWidget(item, index)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.calendar'"
              >
                <v-overlay :value="loading.calendar" absolute>
                  <v-progress-circular
                    indeterminate
                    size="64"
                  ></v-progress-circular>
                </v-overlay>
                <v-toolbar color="toolbar">
                  <v-btn
                    text
                    small
                    fab
                    @click="changeDay('subtract')"
                    v-shortkey="['d']"
                  >
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
                      v-model="$store.state.focus"
                      @click:date="fetchEvents(false, true)"
                      no-title
                      scrollable
                      color="info"
                    >
                    </v-date-picker>
                  </v-menu>
                  <v-btn text small fab disabled> </v-btn>
                  <v-spacer></v-spacer>
                  <v-toolbar-title>{{
                    $date($store.state.focus).format("dddd, MMMM Do YYYY")
                  }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  &nbsp;
                  <v-btn text small fab @click="calendarDialog = true">
                    <v-icon>mdi-arrow-expand-all</v-icon>
                  </v-btn>
                  <v-btn
                    text
                    small
                    fab
                    @click="
                      $store.state.focus = $date().format()
                      fetchEvents(false, true)
                    "
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <button
                    style="display: none"
                    v-shortkey="['arrowleft']"
                    @shortkey="changeDay('subtract')"
                  ></button>
                  <button
                    style="display: none"
                    v-shortkey="['arrowright']"
                    @shortkey="changeDay('add')"
                  ></button>
                  <v-btn text small fab @click="changeDay('add')">
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card
                  color="card"
                  style="position: sticky"
                  :style="
                    'background-color: ' +
                    $vuetify.theme.themes[
                      $vuetify.theme.dark ? 'dark' : 'light'
                    ].card
                  "
                >
                  <v-tabs background-color="card" fixed-tabs v-model="tab">
                    <v-tab
                      @click="type = 'day'"
                      value="day"
                      :style="
                        'background-color: ' +
                        $vuetify.theme.themes[
                          $vuetify.theme.dark ? 'dark' : 'light'
                        ].card
                      "
                    >
                      Daily Schedule
                    </v-tab>
                    <v-tab
                      @click="type = 'week'"
                      value="week"
                      :style="
                        'background-color: ' +
                        $vuetify.theme.themes[
                          $vuetify.theme.dark ? 'dark' : 'light'
                        ].card
                      "
                    >
                      Weekly Schedule
                    </v-tab>
                    <v-tab
                      @click="type = 'month'"
                      value="month"
                      v-if="false"
                      :style="
                        'background-color: ' +
                        $vuetify.theme.themes[
                          $vuetify.theme.dark ? 'dark' : 'light'
                        ].card
                      "
                    >
                      Monthly Schedule
                    </v-tab>
                  </v-tabs>
                  <v-calendar
                    :style="
                      'background-color: ' +
                      $vuetify.theme.themes[
                        $vuetify.theme.dark ? 'dark' : 'light'
                      ].card
                    "
                    :class="type"
                    :ref="'calendar-' + item.id"
                    v-model="$store.state.focus"
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
                    @click:event="pushEvent"
                  >
                  </v-calendar>
                </v-card>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.tasks'"
              >
                <v-overlay :value="loading.tasks" absolute>
                  <v-progress-circular
                    indeterminate
                    size="64"
                  ></v-progress-circular>
                </v-overlay>
                <v-toolbar color="toolbar">
                  <v-btn text fab disabled></v-btn>
                  <v-spacer></v-spacer>
                  <v-toolbar-title>My Tasks</v-toolbar-title>
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
                    $vuetify.theme.themes[
                      $vuetify.theme.dark ? 'dark' : 'light'
                    ].card
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
                        ? $date(item.dueDate).format("dddd, MMMM Do YYYY")
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
                      <p style="white-space: pre-wrap">
                        {{ item.description }}
                      </p>
                      <template v-if="item.activityId"
                        ><b>Subject:</b>
                        {{
                          $store.state.subjects[
                            $store.state.subjects.findIndex(
                              (x) => x.id === item.activityId
                            )
                          ]?.subjectLongName ||
                          item.activityId + " (Unknown Activity)"
                        }}</template
                      >
                    </td>
                    <td :colspan="headers.length" v-else>
                      <span>Only rich notes are expandable.</span>
                    </td>
                  </template>
                </v-data-table>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.events'"
              >
                <v-toolbar color="toolbar">
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
                    color="card"
                  >
                    <v-container>
                      <router-link
                        style="text-decoration: none"
                        :to="'/user/' + $store.state.user.userId + '/events'"
                        >{{ item.LinkText }}</router-link
                      ><br />
                      <small>{{ item.Body }}</small>
                    </v-container>
                  </v-card>
                </v-container>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.news'"
              >
                <v-toolbar color="toolbar">
                  <v-spacer></v-spacer>
                  <v-toolbar-title
                    >{{ $store.state.school.name }} News</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card
                  v-for="item in news"
                  :key="item.id"
                  class="rounded-xl mx-2 ma-3"
                  dense
                  elevation="3"
                  text
                  color="card"
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
                      <div
                        class="text-block"
                        style="white-space: pre-line"
                        v-html="item.Content1"
                      ></div>
                      <v-card-actions class="justify-center">
                        <v-chip
                          v-for="attachment in item.Attachments"
                          :key="attachment.id"
                          :href="
                            attachment.UiLink +
                            '&compassInstance=' +
                            $store.state.school.instance
                          "
                          download
                          color="indigo"
                          dark
                        >
                          <v-icon>mdi-download</v-icon>
                          {{ attachment.Name }}
                        </v-chip>
                      </v-card-actions>

                      <small>{{
                        $date(item.PostDateTime).format(
                          "dddd, MMMM Do YYYY, hh:mm A"
                        )
                      }}</small>
                    </div>
                  </v-container>
                </v-card>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3 text-center justify-center"
                elevation="7"
                v-if="item.name === 'home.weather' && weather.name"
              >
                <v-toolbar color="toolbar">
                  <v-spacer></v-spacer>
                  <v-toolbar-title> Weather </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      {{ weather.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >{{ $date().format("dddd, MMMM Do YYYY") }},
                      {{ weather.weather[0].main }}:
                      {{ weather.weather[0].description }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-card-text>
                  <v-row align="center">
                    <v-col class="text-h2">
                      {{ weather.main.temp }}&deg;C
                    </v-col>
                  </v-row>
                  <small>Feels like: {{ weather.main.feels_like }}&deg;C</small>
                </v-card-text>

                <v-list-item>
                  <v-list-item-subtitle>
                    {{ weather.wind.speed }} km/h wind
                    speed</v-list-item-subtitle
                  >
                </v-list-item>

                <v-list-item>
                  <v-list-item-subtitle>
                    {{ weather.main.humidity }}% humidity</v-list-item-subtitle
                  >
                </v-list-item>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.features'"
              >
                <v-toolbar color="toolbar">
                  <v-spacer></v-spacer>
                  <v-toolbar-title
                    >What's new in BetterCompass?</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-container>
                  <v-card-title> 07/04/2022 </v-card-title>
                  <ul>
                    <li>Fixed rubric not showing teacher results.</li>
                    <li>Fixed missing rubric tab on User Learning Tasks.</li>
                    <li>
                      Added rubric learning task tag, and Compass tags
                      (Assessment, Assignment, etc).
                    </li>
                    <li>Added past events to User Events.</li>
                    <li>Added event resources to User Events.</li>
                    <li>Event descriptions are now sanitized.</li>
                  </ul>
                  <small
                    >BetterCompass version
                    {{ $store.state.versioning.version }}, built on
                    {{ $store.state.versioning.date }}</small
                  >
                </v-container>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.placeholder'"
              >
                <v-toolbar color="toolbar">
                  <v-spacer></v-spacer>
                  <v-toolbar-title>Placeholder</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-container>
                  <v-card-title> Placeholder </v-card-title>
                  <small>Placeholder</small>
                </v-container>
              </v-card>
              <v-card
                :color="color(item)"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.compassScore'"
              >
                <v-toolbar :color="computeCompassScoreDescription.color">
                  <v-spacer></v-spacer>
                  <v-toolbar-title>Your CompassScore</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-container class="justify-center text-center">
                  <h1 style="font-size: 150px">
                    {{ Math.round(computeCompassScore) }}%
                  </h1>
                  <h2>{{ computeCompassScoreDescription.text }}</h2>
                  <p>{{ computeCompassScoreDescription.description }}</p>
                </v-container>
                <v-card-actions>
                  <v-btn text disabled> 01/04/2022 </v-btn>
                </v-card-actions>
              </v-card>
              <template v-if="item.name === 'home.overdueLearningTasks'">
                <router-link
                  v-if="learningTaskAlert"
                  :to="'/user/' + $store.state.user.userId + '/tasks'"
                  style="text-decoration: none"
                >
                  <v-alert
                    dismissible
                    v-model="learningTaskAlert"
                    elevation="5"
                    class="rounded-xl ma-3"
                    type="warning"
                  >
                    {{ overDueLearningTasks }} overdue learning tasks.
                  </v-alert>
                </router-link>
              </template>
              <template v-if="item.name === 'home.notifications'">
                <router-link
                  v-if="learningTaskAlert"
                  :to="'/user/' + $store.state.user.userId + '/tasks'"
                  style="text-decoration: none"
                >
                  <v-alert
                    v-for="alert in alerts"
                    :key="alert.id"
                    type="info"
                    class="rounded-xl ma-3"
                  >
                    {{ alert.Body }}
                  </v-alert>
                </router-link>
              </template>
              <v-card
                color="card"
                class="rounded-xl ma-3"
                elevation="7"
                v-if="item.name === 'home.learningTasks'"
              >
                <v-overlay v-if="loading.learningTasks" absolute>
                  <v-progress-circular
                    indeterminate
                    size="64"
                  ></v-progress-circular>
                </v-overlay>
                <v-toolbar color="toolbar">
                  <v-spacer></v-spacer>
                  <v-toolbar-title
                    >Learning Tasks ({{
                      computeLearningTasks.length
                    }})</v-toolbar-title
                  >&nbsp;
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-on="on" v-bind="attrs">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <span>
                      Only shows tasks newer than 10 weeks, and submitted tasks
                      newer than 2 weeks (relevant tasks).
                    </span>
                  </v-tooltip>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-container>
                  <v-data-table
                    :headers="learningTasksHeaders"
                    :items="computeLearningTasks"
                    :items-per-page="5"
                    class="elevation-3"
                    @click:row="learningTaskDialog"
                    style="cursor: pointer"
                    :style="
                      'background-color: ' +
                      $vuetify.theme.themes[
                        $vuetify.theme.dark ? 'dark' : 'light'
                      ].card
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
                        <v-chip
                          v-if="getCategory(item)"
                          :color="getCategory(item).color"
                        >
                          {{ getCategory(item).categoryName }}
                        </v-chip>
                      </v-chip-group>
                    </template>
                    <template v-slot:item.status="{ item }">
                      <v-icon v-if="getStatus(item).status === 'pending'">
                        mdi-circle-outline
                      </v-icon>
                      <v-icon
                        v-if="getStatus(item).status === 'submitted'"
                        color="green"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon
                        v-if="getStatus(item).status === 'submittedLate'"
                        color="orange"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon
                        v-if="getStatus(item).status === 'pendingLate'"
                        color="red"
                      >
                        mdi-alert-circle-outline
                      </v-icon>
                      {{ getStatus(item).text }}
                    </template>
                  </v-data-table>
                </v-container>
              </v-card>
            </div>
          </draggable>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import dayjs from "dayjs"

export default {
  name: "Home",
  components: {
    draggable
  },
  data() {
    return {
      calendarDialog: false,
      gradingSchemes: [],
      rowsPerPage: 10,
      newFeedback: "",
      sortBy: "activityName",
      dialog: false,
      rubricItems: [],
      rubricHeaders: [
        {
          text: "Criteria",
          value: "criteria",
          width: "13%",
          sortable: false
        }
      ],
      upload: {
        file: null,
        loading: false,
        dialog: false,
        type: 1
      },
      page: 1,
      offset: 0,
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
        students: [
          {
            results: 0
          }
        ],
        subjectName: "PLACEHOLDER",
        submissionItems: []
      },
      learningTasks: [],
      learningTasksHeaders: [
        {
          text: "Title",
          value: "name"
        },
        { text: "Tags", value: "tags", sortable: false },
        { text: "Activity", value: "activityName" },
        { text: "Subject", value: "subjectName" },
        { text: "Due Date", value: "dueDateTimestamp" },
        { text: "Status", value: "status" }
      ],
      editMode: false,
      items: [
        {
          itemId: 0,
          name: "home.calendar",
          friendlyName: "Calendar Widget"
        },
        {
          itemId: 1,
          name: "home.tasks",
          friendlyName: "Tasks Widget"
        },
        {
          itemId: 2,
          name: "home.events",
          friendlyName: "Events Widget"
        },
        {
          itemId: 3,
          name: "home.news",
          friendlyName: "News Widget"
        },
        {
          itemId: 4,
          name: "home.weather",
          friendlyName: "Weather Widget",
          invisible: true
        },
        {
          itemId: 5,
          name: "home.features",
          friendlyName: "Features Widget"
        },
        {
          itemId: 6,
          name: "home.placeholder",
          friendlyName: "Placeholder Widget",
          shown: false
        },
        {
          itemId: 7,
          name: "home.learningTasks",
          friendlyName: "Learning Tasks Widget"
        },
        {
          itemId: 9,
          name: "home.compassScore",
          friendlyName: "CompassScore Widget",
          shown: localStorage.getItem("compassScoreEnabled") === "true"
        },
        {
          itemId: 10,
          name: "home.notifications",
          friendlyName: "Warnings/Notifications Widget",
          invisible: true
        },
        {
          itemId: 11,
          name: "home.overdueLearningTasks",
          friendlyName: "Overdue Learning Tasks Warning Widget",
          invisible: true
        }
      ],
      grids: [
        {
          items: [
            {
              id: 0,
              name: "home.calendar",
              friendlyName: "Calendar Widget"
            },
            {
              id: 1,
              name: "home.tasks",
              friendlyName: "Tasks Widget"
            },
            {
              id: 2,
              name: "home.events",
              friendlyName: "Events Widget"
            }
          ]
        },
        {
          items: [
            {
              id: 3,
              name: "home.news",
              friendlyName: "News Widget"
            },
            {
              id: 4,
              name: "home.weather",
              friendlyName: "Weather Widget"
            },
            {
              id: 5,
              name: "home.features",
              friendlyName: "Features Widget"
            }
          ]
        }
      ],
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
        calendar: false,
        tasks: true,
        learningTasks: true
      },
      learningTaskAlert: false,
      tasks: [],
      type: "day",
      mode: "column",
      alerts: [],
      overDueLearningTasks: 0,
      weekday: [1, 2, 3, 4, 5],
      value: "",
      events: [],
      focus: this.$date().format(),
      news: [],
      user: {},
      weather: {},
      score: null
    }
  },
  computed: {
    cleanLessonPlan() {
      return this.$sanitize(this.selectedTask.description)
    },
    computeLearningTasks() {
      return this.learningTasks.filter(
        (task) =>
          (task.createdTimestamp > dayjs().subtract(2, "week").format() &&
            this.getStatusBoolean(task)) ||
          (task.createdTimestamp > dayjs().subtract(10, "week").format() &&
            !this.getStatusBoolean(task))
      )
    },
    computedItems() {
      return this.items.filter((item) => {
        return item.shown || item.shown === undefined
      })
    },
    computeCompassScore() {
      if (localStorage.getItem("compassScore")) {
        return JSON.parse(localStorage.getItem("compassScore"))
      } else {
        return null
      }
    },
    computeCompassScoreDescription() {
      if (localStorage.getItem("compassScore")) {
        if (this.score >= 90) {
          return {
            color: "success",
            text: "You have an excellent CompassScore.",
            description:
              "You are doing excellent at your current education. You are likely to succeed in your future endeavors."
          }
        } else if (this.score >= 80) {
          return {
            color: "success",
            text: "You have a good CompassScore.",
            description:
              "You are doing good, but this score may lead you to a bad grade. You may need to work harder to improve your score."
          }
        } else if (this.score >= 70) {
          return {
            color: "warning",
            text: "You have an average CompassScore.",
            description:
              "You may need to improve your educational ethic or you may fail, and miss out on potential opportunities."
          }
        } else if (this.score >= 60) {
          return {
            color: "warning",
            text: "You have a below average CompassScore.",
            description:
              "You may need to improve your educational ethic or you may fail, and miss out on potential opportunities."
          }
        } else {
          return {
            color: "red",
            text: "You have a bad CompassScore.",
            description:
              "You have a high chance of failing at your education, future endeavors, and missing out on potential opportunities in the future. Please contact your school to find out more."
          }
        }
      } else {
        return {
          color: null,
          text: "Please go to your profile and take a CompassScore.",
          description:
            "You have not taken a  CompassScore. Please go to your profile and take a  CompassScore."
        }
      }
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
          if (!richNote.hidden)
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
        } else {
          tasks.push(task)
        }
      })
      return tasks
    },
    computeEvents() {
      if (this.$store.state.bcUser.minimizeHeaderEvents) {
        return this.$store.state.calendar.filter((event) => {
          return (
            event.timed ||
            event.color === "#003300" ||
            event.color === "#FFBB5B" ||
            event.color === "#133897"
          )
        })
      } else {
        return this.$store.state.calendar
      }
    }
  },
  methods: {
    updateRows(val) {
      this.$store.dispatch("saveOnlineSettings", {
        rowsPerPage: val
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
      console.log(gradingItem)
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
    learningTaskDialog(task) {
      this.selectedTask = null
      this.selectedTask = task
      this.rubricItems = []
      this.rubricHeaders = [
        {
          text: "Criteria",
          value: "criteria",
          width: "13%",
          sortable: false
        }
      ]
      // only supports single rubric for now, no lesson plan for multiple available.
      if (task.rubricWikiNodeIds) {
        this.loading.learningTasks = true
        this.axios
          .post("/Services/Rubrics.svc/GetRubric", {
            id: null,
            wikiNodeId: task.rubricWikiNodeIds[0]
          })
          .then((res) => {
            this.loading.learningTasks = false
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
    getStatusBoolean(item) {
      if (item.students[0].submissionStatus === 1) {
        return false
      } else if (item.students[0].submissionStatus === 2) {
        return false
      } else if (item.students[0].submissionStatus === 3) {
        return true
      } else return item.students[0].submissionStatus === 4
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
    discardGrid() {
      this.$store.dispatch("getUserInfo").then(() => {
        this.grids = this.$store.state.bcUser?.homeGrids
      })
    },
    color(item) {
      if (item.name === "home.compassScore") {
        return this.computeCompassScoreDescription.color
      } else {
        return "card"
      }
    },
    saveGrid() {
      this.$store.dispatch("saveOnlineSettings", {
        homeGrids: this.grids
      })
      this.$store.dispatch("getUserInfo")
    },
    restoreDefaults() {
      this.grids = [
        {
          items: [
            {
              id: 7,
              itemId: 11,
              name: "home.overdueLearningTasks",
              friendlyName: "Overdue Learning Tasks Warning Widget",
              invisible: true
            },
            {
              itemId: 0,
              id: 0,
              name: "home.calendar",
              friendlyName: "Calendar Widget"
            },
            {
              itemId: 1,
              id: 1,
              name: "home.tasks",
              friendlyName: "Tasks Widget"
            },
            {
              itemId: 2,
              id: 2,
              name: "home.events",
              friendlyName: "Events Widget"
            }
          ]
        },
        {
          items: [
            {
              id: 6,
              itemId: 10,
              name: "home.notifications",
              friendlyName: "Warnings/Notifications Widget",
              invisible: true
            },
            {
              itemId: 3,
              id: 3,
              name: "home.news",
              friendlyName: "News Widget"
            },
            {
              itemId: 4,
              id: 4,
              name: "home.weather",
              friendlyName: "Weather Widget",
              invisible: true
            },
            {
              itemId: 5,
              id: 5,
              name: "home.features",
              friendlyName: "Features Widget"
            }
          ]
        }
      ]
    },
    addGrid() {
      this.grids.push({ items: [] })
    },
    removeGrid(index) {
      this.grids.splice(index, 1)
    },
    addWidget(item) {
      this.grids[0].items.unshift({
        id: this.grids.reduce((acc, grid) => {
          return acc + grid.items.length
        }, 0),
        itemId: item.itemId,
        name: item.name,
        friendlyName: item.friendlyName,
        invisible: item.invisible
      })
    },
    removeWidget(widget, grid) {
      this.grids[grid].items.splice(this.grids[grid].items.indexOf(widget), 1)
    },
    diffMinutes(min, max) {
      const Y = (max.year - min.year) * 525600
      const M = (max.month - min.month) * 43800
      const D = (max.day - min.day) * 1440
      const h = (max.hour - min.hour) * 60
      const m = max.minute - min.minute

      return Y + M + D + h + m
    },
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
          dueDate: this.$date(task.dueDate).format("YYYY-MM-DD"),
          id: task.id,
          status: task.status
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
      const date =
        this.task.dueDate === "Invalid date" ? null : this.task.dueDate
      if (!this.task.richNote) {
        this.axios
          .post("/Services/TaskService.svc/" + route, {
            task: {
              taskName: this.task.taskName,
              dueDate: date,
              status: this.task.status,
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
                dueDate: date,
                status: this.task.status
              }),
              dueDate: date,
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
          limit: 25,
          page: 1,
          start: 0
        })
        .then((res) => {
          this.loading.tasks = false
          this.tasks = res.data.d
        })
    },
    getWeather() {
      if (this.$store.state.bcUser.weather) {
        this.axios.get("/api/v1/weather").then((res) => {
          this.weather = res.data
        })
      }
    },
    getLearningTasks() {
      this.loading.learningTasks = true
      this.axios
        .post("/Services/LearningTasks.svc/GetAllLearningTasksByUserId", {
          forceTaskId: 0,
          limit: 2000,
          page: 1,
          sort: '[{"property":"dueDateTimestamp","direction":"ASC"}]',
          start: 0,
          showHiddenTasks: true,
          userId: this.$store.state.user.userId
        })
        .then((res) => {
          this.loading.learningTasks = false
          this.learningTasks = res.data.d.data

          this.computeLearningTasks.forEach((item) => {
            if (this.getStatus(item).status === "pendingLate") {
              this.overDueLearningTasks++
            }
          })
          if (
            this.overDueLearningTasks > 0 &&
            this.$store.state.bcUser.learningTaskNotification
          ) {
            this.learningTaskAlert = true
          }
        })
    },
    pushEvent(event) {
      if (event.event.activityType === 10) {
        this.$router.push("/user/" + this.$store.state.user.userId + "/tasks")
      } else {
        this.$router.push("/activity/" + event.event.instanceId)
      }
    },
    computeColor(event) {
      if (event.color === "#003300") {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarActivityType8
      } else if (event.color === "#133897") {
        return this.$vuetify.theme.themes[
          this.$store.state.bcUser.theme || "dark"
        ].calendarExternalActivity
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
    changeDay(type) {
      if (this.type === "day") {
        if (type === "add") {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .add(1, "day")
            .format("YYYY-MM-DD")
        } else if (type === "subtract") {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .subtract(1, "day")
            .format("YYYY-MM-DD")
        }
        this.fetchEvents(false, false)
      } else if (this.type === "week") {
        if (type === "add") {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .add(7, "day")
            .format("YYYY-MM-DD")
        } else if (type === "subtract") {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .subtract(7, "day")
            .format("YYYY-MM-DD")
        }
        this.fetchEvents(false, true)
      }
    },
    subjectName(event) {
      const subject =
        this.$store.state.subjects[
          this.$store.state.subjects.findIndex((x) => x.name === event.title)
        ]
      if (!subject && event.attendanceMode === 2 && event.allDay) {
        return event.longTitleWithoutTime
      } else if (!subject && event.attendanceMode === 2 && !event.allDay) {
        return event.longTitle
      } else if(!subject) {
        return event.longTitleWithoutTime
      } else {
        if (/<strike>.*<\/strike>&nbsp;/.test(event.longTitleWithoutTime)) {
          return `${
            subject.subjectLongName
          } - (RELIEF: ${event.longTitleWithoutTime.replace(
            /<strike>.*<\/strike>&nbsp;/,
            ""
          )})`
        } else {
          return `${subject.subjectLongName} - (${event.longTitleWithoutTime})`
        }
      }
    },
    fetchEvents(init, load) {
      if (init) {
        if (
          this.$date().day() === 0 &&
          this.$store.state.bcUser.calendarAutoJump &&
          !this.$store.state.calendarInit
        ) {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .add(1, "day")
            .format("YYYY-MM-DD")
          this.fetchEvents(false, false)
        } else if (
          this.$date().day() === 6 &&
          this.$store.state.bcUser.calendarAutoJump &&
          !this.$store.state.calendarInit
        ) {
          this.$store.state.focus = this.$date(this.$store.state.focus)
            .add(2, "day")
            .format("YYYY-MM-DD")
          this.fetchEvents(false, false)
        }
        this.loading.calendar = true
      }
      if (load) {
        this.loading.calendar = true
      }
      this.axios
        .post("/Services/Calendar.svc/GetCalendarEventsByUser", {
          activityId: null,
          endDate: this.$date(this.$store.state.focus)
            .add(7, "day")
            .format("YYYY-MM-DD"),
          homePage: true,
          limit: 25,
          locationId: null,
          page: 1,
          staffIds: null,
          start: 0,
          startDate: this.$date(this.$store.state.focus)
            .subtract(7, "day")
            .format("YYYY-MM-DD"),
          userId:
            this.$store.state.user?.userId || localStorage.getItem("userId")
        })
        .then((res) => {
          this.$store.commit("setCalendarInit", true)
          this.$store.commit(
            "setCalendar",
            res.data.d.map((event) => {
              return {
                name: this.subjectName(event),
                content: event.longTitle,
                color: event.backgroundColor,
                start: new Date(event.start),
                end: new Date(event.finish),
                timed: !event.allDay && event.attendanceMode === 1,
                activityType: event.activityType,
                activityId: event.activityId,
                instanceId: event.instanceId
              }
            })
          )
          this.loading.calendar = false
        })
    },
    getAlerts() {
      this.axios.post("/Services/NewsFeed.svc/GetMyAlerts").then((res) => {
        this.alerts = res.data.d
      })
    },
    getNews() {
      this.axios
        .post("/Services/NewsFeed.svc/GetMyNewsFeedPaged", {
          limit: 10,
          start: 0
        })
        .then((res) => {
          this.news = res.data.d.data
        })
    }
  },
  mounted() {
    this.score = this.computeCompassScore
    this.getCategories()
    this.getLearningSchemes()
    this.getTasks()
    if (!localStorage.getItem("calendarType")) {
      localStorage.setItem("calendarType", "day")
    }
    this.type = localStorage.getItem("calendarType") || "day"
    this.tab = localStorage.getItem("calendarType") === "day" ? 0 : 1
    this.grids = this.$store.state.bcUser?.homeGrids
    this.$store.dispatch("getUserInfo").then((res) => {
      this.user = res
      this.grids = this.$store.state.bcUser?.homeGrids
      if (this.$store.state.calendar.length) {
        this.fetchEvents(false, false)
      } else {
        this.fetchEvents(true, false)
      }
      this.getWeather()
      this.getNews()
      this.getAlerts()
      this.getLearningTasks()
    })
  },
  watch: {
    "$store.state.editMode"(val) {
      if (val === "save") {
        this.saveGrid()
      } else if (val === "discard") {
        this.$store.dispatch("getUserInfo").then(() => {
          this.grids = this.$store.state.bcUser?.homeGrids
        })
      }
    },
    "$store.state.focus"(val) {
      if (val === "2069-04-20") {
        this.$toast.success("Enabled CompassScore")
        localStorage.setItem("compassScoreEnabled", true)
      }
    },
    type() {
      this.fetchEvents(false, false)
      localStorage.setItem("calendarType", this.type)
    },
    learningTaskAlert() {
      if (!this.learningTaskAlert) {
        this.$store.dispatch("saveOnlineSettings", {
          learningTaskNotification: false
        })
      }
    }
  }
}
</script>
