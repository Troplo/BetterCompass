<template>
  <div>
    <v-dialog v-model="dialog" max-width="900px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title> {{ selectedEvent.name }} - Event </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <h3>Description and educative purpose:</h3>
          <html
            v-html="sanitize(selectedEvent.educativePurpose)"
          ></html>
          <h3>When and where:</h3>
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
                <th class="text-left">Location</th>
                <th class="text-left">Start</th>
                <th class="text-left">Finish</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in selectedEvent.sessions" :key="item.name">
                <td>{{ item.campusName }}</td>
                <td>
                  {{
                    $date(item.start).format("hh:mm A, dddd, MMMM Do YYYY")
                  }}
                </td>
                <td>
                  {{
                    $date(item.finish).format("hh:mm A, dddd, MMMM Do YYYY")
                  }}
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <template v-if="selectedEvent.additionalDetails">
            <h3>Additional details:</h3>
            <html
              v-html="
              sanitize(selectedEvent.additionalDetails)
            "
            ></html>
          </template>
          <template v-if="selectedEvent.transport">
            <h3>Transportation:</h3>
            <html
              v-html="sanitize(selectedEvent.transport)"
            ></html>
          </template>
          <h3 v-if="selectedEvent.resources?.length">Resources:</h3>
          <v-card-text v-if="selectedEvent.resources?.length">
            <v-btn
              color="info"
              text
              v-for="resource in selectedEvent.resources"
              :key="resource.name"
              class="mb-3"
              :href="
                        '/Services/FileAssets.svc/DownloadFile?id=' +
                        resource.content.fileAssetId +
                        '&originalFileName=' +
                        resource.content.filename +
                        '&compassInstance=' +
                        $store.state.school.instance
                      "
              target="_blank"
              style="text-decoration: none;"
            >
              <v-icon> mdi-download </v-icon>
              {{ resource.name }}
            </v-btn>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card color="card" elevation="7" class="rounded-xl">
      <v-toolbar color="toolbar">
        <v-toolbar-title>{{ selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1) }} Events ({{computedEvents.length}})</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-select :items="eventTypes" v-model="selectedEventType" label="Event Type" item-text="name" item-value="value"               solo
                    hide-details
                    single-line></v-select>
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card
          color="card"
          class="mb-3"
          v-for="event in computedEvents"
          :key="event.id"
          @click="openEvent(event)"
        >
          <v-card-title class="subtitle-1">{{ event.name }}</v-card-title>
          <v-card-title class="subtitle-2"
          >{{ $date(event.start).format("hh:mm A, dddd, MMMM Do YYYY") }} -
            {{
              $date(event.finish).format("hh:mm A, dddd, MMMM Do YYYY")
            }}</v-card-title
          >
          <v-chip-group>
            <v-chip class="ml-3" color="indigo">{{
                event.cost === 0 ? "Free" : "$" + event.cost
              }}</v-chip>
            <v-chip v-if="event.attendeeStatus === 1" color="success"
            >Attending</v-chip
            >
            <v-chip v-else-if="event.attendeeStatus === 2" color="red"
            >Expired</v-chip
            >
            <v-chip v-else-if="event.attendeeStatus === 4" color="red"
            >Declined</v-chip
            >
            <v-chip v-else color="red"
            >Unknown, please report ({{ event.status }})</v-chip
            >
          </v-chip-group>
        </v-card>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  name: "UserEvents",
  data() {
    return {
      eventTypes: [{
        name: "Upcoming Events",
        value: "upcoming"
      },
        {
          name: "Past Events",
          value: "past"
        }],
      selectedEventType: "upcoming",
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
  computed: {
    computedEvents() {
      if (this.selectedEventType === "upcoming") {
        return this.events
      } else {
        return this.pastEvents
      }
    }
  },
  methods: {
    sanitize(sanitize) {
      return this.$sanitize(sanitize)
    },
    openEvent(event) {
      this.loading = true
      this.selectedEvent = event
      this.axios.post("/Services/ActionCentre.svc/GetResources", {
        eventId: event.id
      }).then(res => {
        this.selectedEvent.resources = res.data.d.children[0].children
        this.loading = false
        this.dialog = true
      }).catch(() => {
        this.loading = false
        this.selectedEvent.resources = []
        this.dialog = true
      })
    },
    dayjs(date) {
      return dayjs(date)
    },
    getEvents() {
      this.axios
        .post("/Services/ActionCentre.svc/GetEvents", {})
        .then((res) => {
          this.events = res.data.d
          this.loading = false
        })
      this.axios
        .post("/Services/ActionCentre.svc/GetPastEvents", {})
        .then((res) => {
          this.pastEvents = res.data.d
        })
    }
  },
  mounted() {
    this.getEvents()
  }
}
</script>

<style scoped></style>
