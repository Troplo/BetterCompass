<template>
  <div>
    <v-card color="card" v-for="user in users" :key="user.id" class="rounded-xl ma-3">
      <v-card-text>{{user.data}}</v-card-text>
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
      this.activity.AttendeeUserIdList.forEach(userId => {
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