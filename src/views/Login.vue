<template>
  <div id="login">
    <div :class="{ outer: !$vuetify.breakpoint.mobile }">
      <div :class="{ middle: !$vuetify.breakpoint.mobile }">
        <div :class="{ innerLogin: !$vuetify.breakpoint.mobile }">
          <v-card color="card" class="rounded-xl" elevation="7" width="700">
            <v-container>
              <v-form ref="form" class="pa-4 pt-6">
                <p class="text-center text-h4">
                  Login to <span class="troplo-title">BetterCompass</span>
                </p>
                <v-autocomplete
                  @keyup.enter="doLogin()"
                  v-model="searchValue"
                  :items="schools"
                  :loading="loading"
                  :search-input.sync="search"
                  color="white"
                  label="Search your School"
                  placeholder="Start typing to Search"
                ></v-autocomplete>
                <v-text-field
                  @keyup.enter="doLogin()"
                  class="rounded-xl"
                  v-model="username"
                  label="Username"
                  placeholder="FOO1000"
                  type="email"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="doLogin()"
                  class="rounded-xl"
                  v-model="password"
                  color="blue accent-7"
                  label="Password"
                  type="password"
                ></v-text-field>
                <br />
                <v-divider class="mt-5"></v-divider>
                <small
                  >BetterCompass is not affiliated with Compass Education.<br />Compass
                  is a registered trademark of Compass Education Pty Ltd
                  (Australia)</small
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="rounded-xl"
                    :loading="loading"
                    color="primary"
                    text
                    @click="doLogin()"
                  >
                    Login
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      school: {
        id: "",
        name: "",
        fqdn: "",
        instance: ""
      },
      loading: false,
      search: "",
      searchValue: "",
      schools: []
    }
  },
  methods: {
    searchSchool() {
      this.axios
        .post(
          "/services/admin.svc/GetSchoolName",
          {
            keyword: this.search
          },
          {
            headers: {
              compassInstance: "devices"
            }
          }
        )
        .then((res) => {
          this.schools = res.data.d
        })
    },
    setInstance() {
      this.axios
        .post(
          "/services/admin.svc/GetSchoolDetailBasic",
          {
            schoolName: this.searchValue
          },
          {
            headers: {
              compassInstance: "devices"
            }
          }
        )
        .then((res) => {
          if (res.data.d) {
            this.school.fqdn = "https://" + res.data.d.Fqdn + "/"
            this.axios.defaults.headers.common["compassInstance"] =
              res.data.d.Fqdn.replace(".compass.education", "")
            this.axios.defaults.headers.common["compassSchoolId"] =
              res.data.d.SchoolId
            this.school.id = res.data.d.SchoolId
            this.school.name = res.data.d.Name
            this.school.instance = res.data.d.Fqdn.replace(
              ".compass.education",
              ""
            )
            localStorage.setItem("schoolFqdn", this.school.fqdn)
            localStorage.setItem("schoolName", this.school.name)
            localStorage.setItem("schoolId", this.school.id)
            localStorage.setItem("schoolInstance", this.school.instance)
            //this.$toast.success("School successfully set to " + this.school.name)
          } else {
            this.$toast.error("Your school is not yet on Compass.")
          }
        })
    },
    doLogin() {
      localStorage.setItem("schoolFqdn", this.school.fqdn)
      localStorage.setItem("schoolName", this.school.name)
      localStorage.setItem("schoolId", this.school.id)
      localStorage.setItem("schoolInstance", this.school.instance)
      this.$store.commit("setSchool", this.school)
      this.loading = true
      this.axios
        .post("/services/admin.svc/AuthenticateUserCredentials", {
          password: this.password,
          username: this.username,
          schoolId: this.$store.state.school.id
        })
        .then((res) => {
          if (!res.data.d.success) {
            this.$toast.error("Invalid username or password.")
            this.loading = false
          } else {
            console.log(res.data.d?.roles[0].id)
            localStorage.setItem("userId", res.data.d?.roles[0].id)
            this.axios
              .post("/services/mobile.svc/GetPersonalDetails", {
                userId: res.data.d?.roles[0].userId
              })
              .then((response) => {
                localStorage.setItem("userId", response.data.d.data.userId)
                this.$store.dispatch("getUserInfo").then(() => {
                  this.$router.push("/")
                })
              })
              .catch(() => {
                this.$toast.error(
                  "There was a validation error. Please refresh and login again."
                )
              })
          }
        })
        .catch(() => {
          this.$toast.error("Something went wrong, perhaps Compass is down?")
        })
      this.axios
        .post("/services/admin.svc/GetApiKey", {
          password: this.password,
          schoolId: this.$store.state.school.id,
          sussiId: this.username
        })
        .then((res) => {
          if (res.data.d) {
            this.loading = false
            localStorage.setItem("apiKey", res.data.d)
            this.$store.commit("setToken", res.data.d)
            this.$router.push("/")
          } else {
            this.loading = false
            this.$toast.error("Invalid username or password.")
          }
        })
    }
  },
  mounted() {
    this.school.fqdn = localStorage.getItem("schoolFqdn")
    this.school.name = localStorage.getItem("schoolName")
    this.school.id = localStorage.getItem("schoolId")
    this.school.instance = localStorage.getItem("schoolInstance")
    this.search = this.school.name
    this.searchValue = this.school.name
    this.$store.commit("setSchool", this.school)
  },
  watch: {
    search() {
      if (this.search?.length > 2) {
        this.searchSchool()
      }
    },
    searchValue() {
      if (this.searchValue) {
        this.setInstance()
      }
    }
  }
}
</script>

<style scoped>
.outer {
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.middle {
  display: table-cell;
  vertical-align: middle;
}

.innerLogin {
  margin-left: auto;
  margin-right: auto;
  width: 700px;
}
</style>
