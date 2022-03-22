<template>
  <div>
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            {{ selectedEvent.name }} - Event
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <h3>Description and educative purpose:</h3>
          <html v-html="selectedEvent.educativePurpose.replaceAll('color:', 'removed:')"></html>
          <h3>When and where:</h3>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Location
                </th>
                <th class="text-left">
                  Start
                </th>
                <th class="text-left">
                  Finish
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in selectedEvent.sessions"
                  :key="item.name"
              >
                <td>{{ item.campusName }}</td>
                <td>{{ moment(item.start).format("hh:mm A, dddd, MMMM Do YYYY") }}</td>
                <td>{{ moment(item.finish).format("hh:mm A, dddd, MMMM Do YYYY") }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <h3>Additional details:</h3>
          <html v-html="selectedEvent.additionalDetails.replaceAll('color:', 'removed:')"></html>
          <h3>Transportation:</h3>
          <html v-html="selectedEvent.transport.replaceAll('color:', 'removed:')"></html>
        </v-container>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Upcoming Events</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card class="mb-3" v-for="event in events" :key="event.id" @click="openEvent(event)">
          <v-card-title class="subtitle-1">{{event.name}}</v-card-title>
          <v-card-title class="subtitle-2">{{moment(event.start).format("hh:mm A, dddd, MMMM Do YYYY")}} -  {{moment(event.finish).format("hh:mm A, dddd, MMMM Do YYYY")}}</v-card-title>
          <v-chip-group>
            <v-chip class="ml-3" color="indigo">{{event.cost === 0 ? "Free" : "$" + event.cost}}</v-chip>
            <v-chip v-if="event.attendeeStatus === 1" color="success">Attending</v-chip>
            <v-chip v-else-if="event.attendeeStatus === 2" color="red">Expired</v-chip>
            <v-chip v-else-if="event.attendeeStatus === 4" color="red">Declined</v-chip>
            <v-chip v-else color="red">Unknown, please report ({{event.status}})</v-chip>
          </v-chip-group>
        </v-card>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "UserEvents",
  data() {
    return {
      loading: true,
      events: [],
      pastEvents: [],
      selectedEvent: {
        educativePurpose: "",
        additionalDetails: "",
        transport: ""
      },
      dialog: false
    }
  },
  methods: {
    openEvent(event) {
      this.selectedEvent = event
      this.dialog = true
    },
    moment(date) {
      return moment(date);
    },
    getEvents() {
      this.axios.post("/Services/ActionCentre.svc/GetEvents", {}).then((res) => {
        this.events = res.data.d
        this.loading = false
      })
      this.axios.post("/Services/ActionCentre.svc/GetPastEvents", {}).then((res) => {
        this.pastEvents = res.data.d
      })
    }
  },
  mounted() {
    this.getEvents()
  }
}
</script>

<style scoped>

</style>