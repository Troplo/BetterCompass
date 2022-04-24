<template>
  <div id="login">
    <v-dialog v-model="tokenInfo" max-width="700px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title> Compass Token Information </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card-title>Why would you need to use this?</v-card-title>
          <v-card-text
            >This authentication method may be useful if your school uses SSO
            (Single-Sign-On)/SAML authentication instead of the regular default
            Compass username/password which currently isn't supported by
            BetterCompass, and you'll need to manually provide your token
            here.</v-card-text
          >
          <v-card-text
            >If your school uses the default Compass username/password
            authentication, it is recommended to ignore this option for
            convenience, however you may use this anyway if you do not feel
            comfortable entering your password on this website.</v-card-text
          >
          <v-card-title>How can I obtain it?</v-card-title>
          <ul>
            <li>
              Please login to normal Compass, (eg.
              {{
                $store.state.school.instance
                  ? $store.state.school.instance + ".compass.education"
                  : "school.compass.education"
              }}) using SSO.
            </li>
            <li>
              On the page, press CTRL + SHIFT + I to open up DevTools, and head
              over to the "Application" tab.
            </li>
            <li>
              On the sidebar, go to Cookies, and then you should see the option
              to select your Compass domain.
            </li>
            <li>
              You should see a list of cookies on the right, find
              ASP.NET_SessionId and copy the value.
            </li>
            <li>
              Paste/enter the value in the token box, and login (leave Username
              and Password blank as it is optional with this authentication
              method).
            </li>
            <img
              src="../assets/images/cookieInstructions.png"
              height="400"
              alt="Screenshot of Chromium DevTools"
            />
          </ul>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="tokenInfo = false" text>Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="usageDisclaimer" max-width="700px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title> BetterCompass Disclaimer </v-toolbar-title>
        </v-toolbar>
        <v-container>
          BetterCompass is open source software, and is provided under the GNU
          General Public License v3.
          <br />
          The source code can be found
          <a href="https://github.com/Troplo/BetterCompass" target="_blank"
            >here</a
          >, and the license of this piece of software can be found
          <a
            href="https://github.com/Troplo/BetterCompass/LICENSE"
            target="_blank"
            >here</a
          >.
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="privacyPolicy" max-width="700px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title> BetterCompass Privacy Policy </v-toolbar-title>
        </v-toolbar>
        <v-container>
          BetterCompass uses a proxy to access JDLF compass.education services,
          which may pose a privacy risk as it is another point of potential data
          interception.<br /><br />
          Upon initial login, a database object with your Compass username, ID,
          hash, and Compass school ID is created on the BetterCompass server.
          This information is used to validate your login for enhanced
          BetterCompass features such as Settings sync, communications, and
          more.<br /><br />
          Other than the information listed above, we do not store any secret,
          or personal information that could be used to identify you, such as
          your full name, password, email address, or authentication token.<br /><br />
          When updating your BetterCompass Settings, and other BetterCompass
          Exclusive features, this will get saved on the BetterCompass
          server.<br /><br />
          We try and store as little information as possible on the
          BetterCompass server, and only store the information necessary to
          provide a functioning service.<br /><br />
          THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
          APPLICABLE LAW, as stated by the GNU General Public License v3.<br /><br />
          BetterCompass also uses Analytics software named "Matomo", which is
          hosted by BetterCompass to collect usage statistics. This information
          is used to improve the BetterCompass service and to provide a better
          user experience. The full privacy policy for Matomo can be viewed
          <a href="https://matomo.org/privacy-policy/" target="_blank">here</a
          >.<br /><br />
        </v-container>
      </v-card>
    </v-dialog>
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
                  v-model="searchValue"
                  :items="schools"
                  :loading="loading"
                  :search-input.sync="search"
                  color="white"
                  label="Search for your School"
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
                <p class="text-center">OR</p>
                <v-text-field
                  @keyup.enter="doLogin()"
                  class="rounded-xl"
                  v-model="token"
                  label="Token (alternate authentication method, optional)"
                  placeholder="AAAABBBBCCCCDDDD"
                  type="password"
                ></v-text-field>
                <small
                  style="color: #0190ea; cursor: pointer"
                  @click="tokenInfo = true"
                >
                  How to obtain your token, and why you might need to use this.
                </small>
                <v-switch
                  inset
                  label="Remember Me"
                  v-model="rememberMe"
                ></v-switch>
                <small
                  >By logging in you agree to the
                  <a @click="usageDisclaimer = true">
                    BetterCompass Disclaimer</a
                  >,
                  <a @click="privacyPolicy = true">
                    BetterCompass Privacy Policy</a
                  >, and
                  <a
                    style="text-decoration: none"
                    target="_blank"
                    href="https://sites.google.com/a/jdlf.com.au/policies"
                  >
                    JDLF Compass Policies (external)</a
                  >. These may be updated at any time, you will be notified
                  about major changes to the BetterCompass policies.</small
                >
                <v-divider></v-divider>
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
import Vue from "vue"

export default {
  name: "Login",
  data() {
    return {
      rememberMe: false,
      usageDisclaimer: false,
      privacyPolicy: false,
      tokenInfo: false,
      token: "",
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
      if (!this.token) {
        this.axios
          .post("/api/v1/user/login", {
            password: this.password,
            username: this.username,
            schoolId: this.$store.state.school.id,
            rememberMe: this.rememberMe
          })
          .then((res) => {
            if (!res.data.success) {
              this.$toast.error("Invalid username or password.")
              this.loading = false
            } else {
              localStorage.setItem("userId", res.data.userId)
              this.loading = false
              localStorage.setItem("apiKey", res.data.token)
              Vue.axios.defaults.headers.common["CompassAPIKey"] =
                localStorage.getItem("apiKey")
              this.$store.commit("setToken", res.data.token)
              this.$store.dispatch("getUserInfo").then(() => {
                this.$router.push("/")
              })
            }
          })
          .catch(() => {
            this.$toast.error("Invalid username or password.")
            this.loading = false
          })
      } else {
        this.axios
          .post("/api/v1/user/loginWithToken", {
            token: this.token,
            rememberMe: this.rememberMe
          })
          .then(() => {
            this.axios
              .get("/api/v1/user")
              .then((res) => {
                localStorage.setItem("userId", res.data.id)
                localStorage.setItem("apiKey", "")
                Vue.axios.defaults.headers.common["CompassAPIKey"] =
                  localStorage.getItem("apiKey")
                this.$store.dispatch("getUserInfo").then(() => {
                  this.$router.push("/")
                })
              })
              .catch(() => {
                this.$toast.error("Invalid token.")
                this.loading = false
              })
          })
          .catch(() => {
            this.$toast.error("Invalid token.")
            this.loading = false
          })
      }
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
