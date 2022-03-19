<template>
  <div>
    <v-card elevation="3">
      <v-container>
        <v-row>
          <v-col sm="1">
            <v-img :src="$store.state.school.fqdn + '/download/cdn/full/' + $store.state.user.imageGuid" width="200"></v-img>
          </v-col>
          <v-col>
            <p>
              Name: <b>{{ $store.state.user.firstName }} {{ $store.state.user.lastName }}</b><br>
              Student ID (SussiID): <b>{{ $store.state.user.sussiId }}</b><br>
              <template v-if="$store.state.parent">Parent ID (SussiID): <b>Configure parent linking in BetterCompass settings.</b><br></template>
              Email: <b>{{ $store.state.user.email }}</b><br>
              Age: <b>{{ user.userDetails }}</b><br>
              Today's Attendance:

            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    {{user}}
  </div>
</template>

<script>
export default {
  name: "UserDashboard",
  props: ["user"],
  mounted() {

  }
}
</script>

<style scoped>

</style>