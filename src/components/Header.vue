<template>
  <div id="header">
    <v-dialog v-model="feedback.modal" width="700">
      <v-card color="card" elevation="7">
        <v-card-title>
          <span class="text-h5">Provide Feedback</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  class="rounded-xl"
                  disabled
                  v-model="feedback.route"
                  label="Route"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                Rating:
                <v-rating
                  v-model="feedback.rating"
                  background-color="grey darken-1"
                  color="yellow darken-3"
                  empty-icon="$ratingFull"
                  hover
                ></v-rating>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  class="rounded-xl"
                  v-model="feedback.text"
                  label="Enter your Feedback"
                  required
                  @keyup.enter="submitFeedback"
                ></v-text-field>
              </v-col>
              <small
                >Your feedback will be used to make BetterCompass even
                better.</small
              >
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="rounded-xl"
            color="blue darken-1"
            text
            @click="feedback.modal = false"
          >
            Close
          </v-btn>
          <v-btn
            class="rounded-xl"
            color="blue darken-1"
            text
            @click="submitFeedback()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar app v-if="$store.state.user" color="dark">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="$vuetify.breakpoint.mobile"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
        v-if="!$vuetify.breakpoint.mobile"
        :style="
          'color: ' +
          $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].primary
        "
        :class="{ 'troplo-title': !$store.state.bcUser.accentColor }"
        @click="$router.push('/')"
        style="cursor: pointer"
        >BetterCompass</v-toolbar-title
      ><v-app-bar-nav-icon
        v-if="
          !$vuetify.breakpoint.mobile && $store.state.site.release !== 'stable'
        "
        style="z-index: 1000"
        disabled
        >{{ $store.state.site.release }}</v-app-bar-nav-icon
      >
      <v-text-field
        ref="searchInput"
        autocomplete="off"
        class="mx-2 mx-md-4"
        dense
        hide-details
        outlined
        placeholder="English"
        :label="
          $vuetify.breakpoint.mobile
            ? 'Search BetterCompass...'
            : 'Search BetterCompass... (CTRL + K)'
        "
        @click="$store.commit('setSearch', true)"
        style="max-width: 450px"
      >
      </v-text-field>
      <button
        style="display: none"
        v-shortkey="['ctrl', 'k']"
        @shortkey="$store.commit('setSearch', true)"
      >
        Debug
      </button>
      <button
        style="display: none"
        v-shortkey="['ctrl', 'alt', 's']"
        @shortkey="enableCompassScore"
      >
        Enable CompassScore
      </button>
      <v-spacer></v-spacer>
      <v-menu
        v-if="$store.state.user.username"
        offset-y
        rounded
        class="rounded-xxl"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="rounded-xl" icon v-bind="attrs" v-on="on">
            <v-avatar
              v-if="!$store.state.user.avatar"
              align="center"
              class="text-center"
              size="38"
            >
              <v-icon v-if="!$store.state.user.avatar"
                >mdi-account-circle</v-icon
              >
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in menus.dropdownAuthenticated"
            :key="item.id"
            :disabled="item.disabled"
            :to="item.path"
            :style="'color:' + item.color"
            @click="handleClickDropdown(index)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
          <template v-if="$store.state.user.admin">
            <v-list-item
              v-for="(item, index) in menus.admin"
              :key="item.id"
              :disabled="item.disabled"
              :to="item.path"
              @click="handleClickDropdown(index)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>
          <template
            v-if="$store.state.user.moderator || $store.state.user.admin"
          >
            <v-list-item
              v-for="(item, index) in menus.moderator"
              :key="item.id"
              :disabled="item.disabled"
              :to="item.path"
              @click="handleClickDropdown(index)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      v-if="$store.state.user"
      app
      color="dark"
      floating
    >
      <v-list-item v-if="$vuetify.breakpoint.mobile">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-toolbar-title
              v-if="$vuetify.breakpoint.mobile"
              class="text-center justify-center"
              :style="
                'color: ' +
                $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light']
                  .primary
              "
              :class="{ 'troplo-title': !$store.state.bcUser.accentColor }"
              @click="$router.push('/')"
              style="cursor: pointer"
              >BetterCompass</v-toolbar-title
            >
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list v-if="$store.state.user">
          <v-list>
            <template>
              <v-list-item to="/">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-for="user in $store.state.user.children"
                :key="user.userId"
                :to="'/user/' + user.userId"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account-child</v-icon>
                </v-list-item-icon>

                <v-list-item-title
                  >{{ user.firstName }}'s Profile</v-list-item-title
                >
              </v-list-item>

              <v-list-item :to="'/user/' + $store.state.user.userId">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Your Profile</v-list-item-title>
              </v-list-item>

              <v-list-group prepend-icon="mdi-pen">
                <template v-slot:activator>
                  <v-list-item-title>Curriculum</v-list-item-title>
                </template>

                <v-list-group no-action sub-group>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>Pages</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item
                    link
                    :to="'/user/' + $store.state.user.userId + '/tasks'"
                  >
                    <v-list-item-title>Learning Tasks</v-list-item-title>
                  </v-list-item>
                  <v-list-item link to="/school/resources">
                    <v-list-item-title>School Resources</v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-list-group no-action sub-group>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>Subjects & Classes</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item
                    v-for="subject in $store.state.subjects"
                    :key="subject.id"
                    :to="'/activity/activity/' + subject.id"
                    link
                  >
                    <v-list-item-title>{{
                      subject.subjectLongName
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
              <v-list-item
                to="/communications"
                v-if="$store.state.site.release === 'dev'"
              >
                <v-list-item-icon>
                  <v-icon>mdi-android-messages</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Communications</v-list-item-title>
              </v-list-item>
              <v-list-item
                :to="'/user/' + $store.state.user.userId + '/events'"
              >
                <v-list-item-icon>
                  <v-icon>mdi-swim</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Events</v-list-item-title>
              </v-list-item>
              <v-list-item to="/changelog">
                <v-list-item-icon>
                  <v-icon>mdi-git</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Changelog</v-list-item-title>
              </v-list-item>
              <v-list-item @click="feedback.modal = true">
                <v-list-item-icon>
                  <v-icon>mdi-bug</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Provide Feedback</v-list-item-title>
              </v-list-item>
              <v-list-item to="/about">
                <v-list-item-icon>
                  <v-icon>mdi-information</v-icon>
                </v-list-item-icon>

                <v-list-item-title>About BetterCompass</v-list-item-title>
              </v-list-item>
            </template>
            <template v-if="$store.state.site.release === 'dev'">
              <v-list-item
                v-for="(item, index) in menus.debug"
                :key="item.id"
                :to="item.path"
                link
                @click="handleClick(index)"
              >
                <v-list-item-icon>
                  <v-icon
                    v-bind:class="{
                      gradient:
                        item.name === $route.name &&
                        !$store.state.site.whitelabel
                    }"
                    >{{ item.icon }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.name }}
                    <v-chip
                      v-if="item.preview"
                      class="ma-2"
                      color="success"
                      outlined
                      rounded
                      x-small
                    >
                      <v-icon>mdi-flask</v-icon>
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-list>
        <v-list v-else>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon x-large>mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Please login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list>
            <v-list-item
              v-for="(item, index) in menus.default"
              :key="index"
              :to="item.path"
              link
              @click="handleClick(index)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      feedback: {
        modal: false,
        route: "",
        rating: 0,
        text: ""
      },
      report: false,
      drawer: true,
      menus: {
        dropdownAuthenticated: [
          {
            id: 7,
            name: "My Account",
            click() {},
            path: "/user",
            icon: "mdi-settings"
          },
          {
            id: 6,
            name: "BetterCompass Settings",
            path: "/user/settings",
            icon: "mdi-settings"
          },
          {
            id: 8,
            name: "Logout",
            click() {
              this.$store.dispatch("logout")
            },
            color: "#c53030",
            icon: "mdi-settings"
          }
        ],
        debug: [],
        default: [
          {
            id: 1,
            name: "Login",
            path: "/login",
            icon: "mdi-login",
            click() {}
          }
        ],
        authenticated: [
          {
            id: 3,
            name: "Dashboard",
            path: "/",
            icon: "mdi-view-dashboard",
            click() {}
          },
          {
            id: 4,
            name: "Profile",
            path: "/profile",
            icon: "mdi-account",
            click() {}
          },
          {
            id: 5,
            name: "Settings",
            path: "/settings",
            icon: "mdi-settings",
            click() {}
          }
        ]
      }
    }
  },
  computed: {
    navColor() {
      if (this.$vuetify.theme.dark) {
        return "#181818"
      } else {
        return "#FFFFFF"
      }
    }
  },
  methods: {
    enableCompassScore() {
      console.log("Enable Hidden CompassScore")
      localStorage.setItem("compassScoreEnabled", true)
    },
    submitFeedback() {
      this.axios
        .post("/api/v1/feedback", {
          text: this.feedback.text,
          starRating: this.feedback.rating,
          route: this.feedback.route
        })
        .then(() => {
          this.feedback.text = ""
          this.feedback.rating = 0
          this.feedback.modal = false
          this.$toast.success("Thank you for making a BetterCompass.")
        })
        .catch(() => {
          this.$toast.error(
            "Something went wrong while submitting feedback, you should submit feedback about this."
          )
        })
    },
    handleClickDropdown(index) {
      this.menus.selected = index
      this.menus.dropdownAuthenticated[index].click.call(this)
    },
    active(path) {
      if (path === this.$route.name) {
        return "#007aff"
      } else {
        return null
      }
    },
    handleClick(index) {
      this.menus.selected = this.$route.name
      this.menus.authenticated[index].click.call(this)
    }
  },
  mounted() {
    this.feedback.route = this.$route.path
    if (this.$vuetify.breakpoint.mobile) {
      this.drawer = false
    }
  },
  watch: {
    $route(to) {
      this.feedback.route = to.path
    },
    "$store.state.user"() {
      this.menus.dropdownAuthenticated = [
        {
          id: 7,
          name: "My Account",
          click() {},
          path: "/user/" + this.$store.state.user?.userId,
          icon: "mdi-settings"
        },
        {
          id: 6,
          name: "BetterCompass Settings",
          path: "/user/" + this.$store.state.user?.userId + "/settings",
          icon: "mdi-settings"
        },
        {
          id: 8,
          name: "Logout",
          click() {
            this.$store.dispatch("logout")
          },
          color: "#c53030",
          icon: "mdi-settings"
        }
      ]
    }
  }
}
</script>

<style scoped></style>
