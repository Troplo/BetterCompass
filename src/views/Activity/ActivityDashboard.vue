<template>
  <div>
    <v-container>
      <v-select
          class="mx-5"
          outlined
          dense
          v-model="selectedActivity"
          :items="activityFull.Instances"
          item-value="id"
          item-text="dt"
          label="Activity Instances"
          @change="pushEvent"
      >
        <template v-slot:item="{ item }">
          <span v-html="item.dt"></span>&nbsp;
          <!-- check if the event is older than now -->
          <v-chip v-if="new Date(item.fn) < new Date()" color="red" outlined small>Previous Session</v-chip>
          <v-chip v-if="new Date(item.fn) > new Date()" color="success" outlined small>Upcoming Session</v-chip>
        </template>
      </v-select>
      <v-card class="rounded-xl ma-3" elevation="7">
        <v-container>
          <v-row>
            <v-col>
              <h3>Teacher</h3>
              <h1>
                <v-avatar
                    large
                >
                  <img :src="getTeacherPhoto">
                </v-avatar>&nbsp;
             {{activity.ManagerTextReadable}}</h1>
            </v-col>
            <v-col>
              <h3>Location</h3>
              <h1>{{activity.LocationDetails.longName}}</h1>
            </v-col>
            <v-col>
              <h3>Seats</h3>
              <h1>{{activity.LocationDetails.seatNumber}}</h1>
            </v-col>
            <v-col>
              <h3>Computers</h3>
              <h1>{{activity.LocationDetails.computerNumber}}</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-row>
        <v-col sm="7">
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>Lesson Plan</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <html v-html="lessonPlan"></html>
            </v-container>
          </v-card>
        </v-col>
        <v-col style="white-space: pre-line; overflow-wrap: anywhere" sm="5">
          <v-card class="rounded-xl ma-3" elevation="7">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>Class News</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <v-card v-for="item in news" :key="item.id">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      <v-avatar
                          large
                          left
                      >
                        <img :src="item.UserImageUrl + '?forceInstance=' + $store.state.school.instance">
                      </v-avatar>&nbsp;
                      {{item.UserName}}
                    </v-list-item-title>
                    <v-list-item-title class="text-h6">
                      {{item.Title}}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{moment(item.PostDateTime).format("hh:mm A, dddd, MMMM Do YYYY")}}</v-list-item-subtitle><br>
                    <p style="white-space: pre-line !important; overflow-wrap: anywhere !important; display: inline-block" v-html="item.Content1"></p>
                    <v-chip v-for="download in item.Attachments" :key="download.id" color="indigo" :href="download.UiLink + '&forceInstance=' + $store.state.school.instance">
                      <v-icon>mdi-download</v-icon>
                      {{download.Name}}
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
import moment from "moment";

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
      selectedActivity: null,
      lp: "<p>No lesson plan has been uploaded yet.</p>",
    }
  },
  computed: {
    getTeacherPhoto() {
      if(this.activity.managers[0].CoveringPhotoPath) {
        return this.activity.managers[0].CoveringPhotoPath.replace('full', 'square') + '?forceInstance=' + this.$store.state.school.instance
      } else {
        return this.activity.managers[0].ManagerPhotoPath.replace('full', 'square') + '?forceInstance=' + this.$store.state.school.instance
      }
    }
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    pushEvent(event) {
      this.$router.push("/activity/" + event);
      this.getActivity(event);
    }
  },
  mounted() {
    this.selectedActivity = this.activity.id;
  },
  watch: {
    $route() {
      this.selectedActivity = this.activity.id;
    }
  }
}
</script>

<style scoped>

</style>