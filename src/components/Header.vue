<template>
  <div id="header" class="wrapper">
    <b-navbar>
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <p class="subtitle">Logo</p>
        </b-navbar-item>
      </template>
      <template #start v-if="$store.state.user.username">
        <b-navbar-item href="#">
          <i class="far fa-calendar-alt orwell-icon"></i>
        </b-navbar-item>
        <b-navbar-dropdown hoverable arrowless>
          <template slot="label">
            <i class="far fa-pencil-alt orwell-icon"></i>
          </template>
          <b-navbar-item tag="router-link" to="/learning/tasks">
            Learning Tasks
          </b-navbar-item>
          <b-navbar-item tag="router-link" to="/learning/resources">
            School Resources
          </b-navbar-item>
          <hr>
          <b-navbar-item tag="router-link" v-for="orwellClass in $store.state.classes.data" :key="'orwell-navbar-classes-' + orwellClass.id" :to="'/class/' + orwellClass.id" >
            {{orwellClass.subjectLongName}}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="router-link" :to="{ path: '/debug' }">
          Debug
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="div" v-if="!$store.state.user.username">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">
              Log in
            </a>
          </div>
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/profile" v-if="$store.state.user.username">
          <i class="fas fa-user-circle orwell-icon"></i>
        </b-navbar-item>
        <b-navbar-item v-if="$store.state.user.username">
          <i class="fa fa-sign-out orwell-icon"></i>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>

</style>