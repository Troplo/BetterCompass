<template>
  <div id="profile" class="section">
    <div class="container">
      <div class="orwell-test">
        <div class="column">
          <div class="box">
            <b-tag size="is-large" style="float: right;" class="is-success">Active</b-tag>
            <p class="title">{{$store.state.user.name}} - {{$store.state.user.yearLevelName}}, {{$store.state.user.house}}</p>
            <p class="subtitle">{{$store.state.user.username}}</p>
            <div class="tabs is-centered">
              <ul>
                <router-link tag="li" :to="'/profile/dashboard'" exact><a>Dashboard</a></router-link>
                <router-link tag="li" :to="'/profile/attendance'" exact><a>Attendance</a></router-link>
                <router-link tag="li" :to="'/profile/tasks'" exact><a>Learning Tasks</a></router-link>
                <router-link tag="li" :to="'/profile/reports'" exact><a>Reports</a></router-link>
                <router-link tag="li" :to="'/profile/analytics'" exact><a>Analytics (NAPLAN)</a></router-link>
              </ul>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile"
}
</script>

<style scoped>

</style>