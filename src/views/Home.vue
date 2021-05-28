<template>
  <div class="home">
    <div class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="box">
              !! TEMPORARY !!<br>
              What's on today?

            </div>
            <div class="box">
              <p class="subtitle">Upcoming Class Coverage and Events</p>
              <span v-for="events in upcoming" :key="events">
                <p v-html="events.Content"></p>
              </span>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p class="subtitle">School News</p>
              <b-message v-for="news in news" :key="news">
                <p><b>{{news.Title}}</b></p><br>
                <p v-html="news.Content1"></p><br>
                <p><b>From: {{news.UserName}}</b></p>
                <p><b>Attachments: </b></p>
                <a :href="'https://bhs-vic.compass.education/' + text.UiLink" type="is-info" v-for="(text, index) in news.Attachments" :key="index">
                  {{text.Name}}
                </a>
              </b-message>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      upcoming: [],
      news: []
    }
  },
  methods: {
  },
  mounted() {
    this.axios
        .post('/Services/NewsFeed.svc/GetMyUpcoming?sessionstate=readonly', {
          userId: this.$store.state.user.id
        })
        .then((res) =>
            this.upcoming = res.data.d
        )
    this.axios
        .post('/Services/NewsFeed.svc/GetMyNewsFeedPaged?sessionstate=readonly', {
          userId: this.$store.state.user.id,
          activityId: null,
          limit: "20",
          start: "0"
        })
        .then((res) =>
            this.news = res.data.d.data
        )
  }
}
</script>