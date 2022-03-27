<template>
  <div>
    <v-card color="card" v-for="user in users" :key="user.ii" class="rounded-xl ma-3">
      <v-card-text>{{user.n.split(", ")[1]}} {{user.n.split(", ")[0]}} ({{user.ii}}, {{user.yln}}, {{user.f}})</v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ActivityRoll",
  props: ["activity"],
  data () {
    return {
      users: [],
    }
  },
  methods: {
    async getUsers() {
      this.axios.post("/Services/Activity.svc/GetEnrolmentsByActivityId", {
        "activityId": this.activity.ActivityId,
        limit: 200,
        page: 1,
        start: 0
      }).then((res) => {
        this.users = res.data.d
      })
      /*this.activity.AttendeeUserIdList.forEach(userId => {
       this.axios.post("/Services/Mobile.svc/GetUsersNameById", {
         "userId": userId
       }).then((res) => {
         this.users.push(res.data.d);
       })
     })
      /*this.axios.post("/Services/User.svc/GetNameById", {
        "userIds": this.activity.AttendeeUserIdList,
        limit: 1000,
        page: 1,
        start: 0
      }).then((res) => {
        this.users = res.data.d
      })*/
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped>

</style>