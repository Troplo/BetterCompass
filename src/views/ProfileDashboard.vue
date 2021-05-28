<template>
  <div id="profileDashboard">
    <div class="columns">
      <div class="column">
        <div class="box">
          <b-message :title="$store.state.user.name" :closable="false">
            <div class="columns">
              <div class="column is-3">
                <img src="/download/cdn/full/user.jpg">
              </div>
              <div class="column">
                <span>Name: {{ $store.state.user.name }}<br>
                  Student Code: {{ $store.state.user.username }}<br>
                Age: {{$store.state.user.info}}<br>
                House: {{$store.state.user.house}}<br>
                Year Level: {{$store.state.user.yearLevelName}}<br>
                School: {{$store.state.school.name}}</span>
              </div>
            </div>
          </b-message>
        </div>
      </div>
      <div class="column">
        <div class="box" v-if="profile.chronicle.data">
          <b-message type="is-danger" v-for="(text,index) in profile.alerts" :key="index">
            {{ text.Body }}
          </b-message>
        </div>
        <div class="box">
          <b-message title="Student Chronicle" :closable="false">
            <p v-for="(text,index) in profile.chronicle.data" :key="index">
              <span type="is-info" v-for="(text2, index2) in text.chronicleEntries" :key="index2">
              <span type="is-info" v-for="(text3, index3) in text2.inputFields" :key="index3">
                <b-message type="is-info">{{text3.value}}</b-message>
                <br>
              </span>
              </span>
            </p>
          </b-message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "ProfileDashboard",
  data() {
    return {
      profile: {
        alerts: [],
        chronicle: []
      }
    }
  },
  methods: {
    getChronicle(startDate, endDate) {
      this.axios
          .post('/Services/ChronicleV2.svc/GetUserChronicleFeed?sessionstate=readonly', {
            userId: this.$store.state.user.id,
            asParent: this.$store.state.user.parent,
            endDate: endDate,
            filterCategoryId: null,
            limit: 25,
            page: 1,
            pageSize: 5,
            start: 0,
            startDate: startDate,
            targetUserId: 5090
          })
          .then((res) => {
            this.profile.chronicle = res.data.d
          })
    }
  },
  mounted() {
    this.axios
        .post('/Services/NewsFeed.svc/GetUserProfileAlerts?sessionstate=readonly', {
          userId: this.$store.state.user.id
        })
        .then((res) => {
          this.profile.alerts = res.data.d
        })
    this.getChronicle(moment().format('01 01 2020'), moment().format('31 12 YYYY'))

  }
}
</script>

<style scoped>

</style>