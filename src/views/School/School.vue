<template>
  <div class="activity">
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="headerImage">
      <v-img
          :src="headerImage"
          aspect-ratio="16/9"
      >
        <v-container fill-height fluid>
          <v-row align="center"
                 justify="center">
            <v-col>
              <h1 style="color: #ffffff;">{{ $store.state.school.name }}</h1>
              <p style="color: #ffffff;">{{ $store.state.school.id }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
      <v-tabs>
        <v-tab to="resources">
          Resources
        </v-tab>
      </v-tabs>
      <router-view :resources="resources"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "School",
  data() {
    return {
      resources: {},
      headerImage: "/Assets12.1.155.5/Pix/ActivityHeader/Generic.svg",
      loading: false
    }
  },
  methods: {
    getResources() {
      this.loading = true;
      this.axios.post("/Services/Wiki.svc/GetSchoolResourcesNode", {}).then((res) => {
        this.resources = res.data.d
        this.loading = false;
      }).catch((err)=> {
        console.log(err);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getResources()
  }
}
</script>

<style scoped>

</style>