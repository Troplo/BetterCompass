<template>
  <div>
    <v-dialog v-model="chronicleInfo" v-if="chronicleInfo" max-width="600px">
      <v-card color="card">
        <v-card-title>
          <span class="headline">{{ selectedChronicle.chronicleEntries[0].templateName }}</span>
        </v-card-title>
        <v-card-text>
          <v-chip-group column>
            <v-chip color="indigo">{{selectedChronicle.chronicleEntries[0].communicationLogs.length}} email recipients</v-chip>
            <v-chip v-if="selectedChronicle.chronicleEntries[0].visibleToParents">Parents</v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-card color="card" elevation="7" class="rounded-xl">
          <v-toolbar color="toolbar">
            <v-toolbar-title>Account</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col sm="2">
                <v-img :src="$store.state.school.fqdn + '/download/cdn/full/' + $store.state.user.imageGuid"
                       width="200"></v-img>
              </v-col>
              <v-col>
                <p>
                  Name: <b>{{ $store.state.user.firstName }} {{ $store.state.user.lastName }}</b><br>
                  Student ID (Username): <b>{{ $store.state.user.sussiId }}</b><br>
                  <template v-if="$store.state.parent">Parent ID (SussiID): <b>Configure parent linking in BetterCompass
                    settings.</b><br></template>
                  Email: <b>{{ $store.state.user.email }}</b><br>
                  Age: <b>{{ user.userDetails }}</b><br>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-chip color="indigo" v-on="on">{{ user.chroniclePinnedCount }}</v-chip>
                    </template>
                    <span>
            Pinned Chronicle Count
          </span>
                  </v-tooltip>
                  <br>
                  Today's Attendance:
                  <v-chip-group>
                    <v-tooltip top v-for="attendance in user.userTimeLinePeriods" :key="attendance.id">
                      <template v-slot:activator="{ on }">
                        <v-chip v-on="on" pill style="opacity: 1" fab :color="getAttendance(attendance.statusName).color">
                          <v-icon>
                            {{getAttendance(attendance.statusName).icon}}
                          </v-icon>
                        </v-chip>
                      </template>
                      <span>{{attendance.name}}: {{attendance.statusName}}</span>
                    </v-tooltip>
                  </v-chip-group>
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card color="card" class="rounded-xl" elevation="7">
          <v-toolbar color="toolbar">
            <v-toolbar-title>Chronicle</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-card color="card" v-for="item in chronicle.items" :key="item.id" class="mb-3">
              <v-toolbar color="toolbar">
                <v-toolbar-title>{{ item.chronicleEntries[0].templateName }}
                  <div class="subheading subtitle-1">Recorded by: {{item.chronicleEntries[0].userNameCreated}}</div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip color="indigo" @click="selectedChronicle = item; chronicleInfo = true">Info</v-chip>
              </v-toolbar>
              <v-container>
                <div v-for="input in item.chronicleEntries[0].inputFields" :key="input.id">
                  <template v-if="JSONExtract(input.value).length">
                    {{ getJSON(input.value) }}
                  </template>
                  <template v-else>
                    {{input.value}}
                  </template>
                </div>
              </v-container>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import JSONExtract from "@/lib/jsonExtract";

export default {
  name: "UserDashboard",
  props: ["user", "chronicle"],
  data() {
    return {
      chronicleInfo: false,
      selectedChronicle: null
    }
  },
  methods: {
    getAttendance(attendanceStatus) {
      if(attendanceStatus === "Present") {
        return {
          color: "green",
          icon: "mdi-check"
        }
      } else if(attendanceStatus === "Not Present") {
        return {
          color: "red",
          icon: "mdi-close"
        }
      } else if(attendanceStatus === "Medical/Illness") {
        return {
          color: "red",
          icon: "mdi-close"
        }
      } else if(attendanceStatus === "Late" || attendanceStatus === "Late Un'd") {
        return {
          color: "orange",
          icon: "mdi-clock"
        }
      } else {
        return {
          color: "grey",
          icon: "mdi-help"
        }
      }
    },
    JSONExtract(str) {
      return JSONExtract(str);
    },
    getJSON(json) {
      const parsed = JSON.parse(json);
      const indexed = parsed[parsed.findIndex(x => x.isChecked)]
      if(indexed) {
        return indexed.valueOption
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>