<template>
  <div>
    <v-dialog v-model="chronicleInfo" v-if="chronicleInfo" max-width="600px">
      <v-card>
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
        <v-card elevation="3" class="rounded-xl">
          <v-toolbar>
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
                  Student ID (SussiID): <b>{{ $store.state.user.sussiId }}</b><br>
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
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="rounded-xl">
          <v-toolbar>
            <v-toolbar-title>Chronicle</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-card v-for="item in chronicle.items" :key="item.id" class="mb-3">
              <v-toolbar>
                <v-toolbar-title>{{ item.chronicleEntries[0].templateName }}
                  <div class="subheading subtitle-1">Recorded by: {{item.chronicleEntries[0].userNameCreated}}</div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip color="indigo" @click="selectedChronicle = item; chronicleInfo = true">Info</v-chip>
              </v-toolbar>
              <v-container>
                <div v-for="input in item.chronicleEntries[0].inputFields" :key="input.id">
                  {{input.value}}
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
export default {
  name: "UserDashboard",
  props: ["user", "chronicle"],
  data() {
    return {
      chronicleInfo: false,
      selectedChronicle: null
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>