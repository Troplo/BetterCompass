<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>
<style lang="scss">
@import './assets/core.scss';
</style>
<style>
@import 'https://kit-pro.fontawesome.com/releases/v5.15.1/css/pro.min.css';
</style>
<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
        this.axios
            .post('/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup?_dc=1622173098998', {
              userId: this.$store.state.user.id,
              targetUserId: this.$store.state.user.id,
              limit: 50,
              page: 1,
              start: 0,
              academicGroupId: -1
            })
            .then((res) =>
                this.$store.commit("initClasses", {
                  classes: res.data.d
                }))
        this.axios
            .post('/Services/User.svc/GetUserDetailsBlobByUserId?sessionstate=readonly&_dc=1622121679514', {
              userId: this.$store.state.user.id,
              targetUserId: this.$store.state.user.id,
            })
            .then((res) =>
                this.$store.commit("initUser", {
                  username: res.data.d.userSussiID,
                  firstName: res.data.d.userPreferredName,
                  lastName: res.data.d.userPreferredLastName,
                  name: res.data.d.userFullName,
                  avatar: "https://bhs-vic.compass.education" + res.data.d.userSquarePhotoPath,
                  yearLevelName: res.data.d.userYearLevel,
                  yearLevel: res.data.d.userYearLevelId,
                  flags: res.data.d.userFlags,
                  email: res.data.d.userEmail,
                  info: res.data.d.userDetails,
                  house: res.data.d.userHouse
                }))
  }
}
</script>