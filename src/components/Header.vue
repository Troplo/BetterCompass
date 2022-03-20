<template>
  <div id="header">
    <v-app-bar app v-if="$store.state.user">
      <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="$vuetify.breakpoint.mobile"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
          class="troplo-title"
          @click="$router.push('/')"
          style="cursor: pointer"
      >BetterCompass</v-toolbar-title
      ><v-app-bar-nav-icon
        style="z-index: 1000"
        disabled
    >Beta</v-app-bar-nav-icon
    >
      <v-text-field
          ref="searchInput"
          autocomplete="off"
          class="mx-2 mx-md-4"
          dense
          hide-details
          outlined
          placeholder="English"
          label="Search Compass... (CTRL + K)"
          @click="$store.commit('setSearch', true)"
          style="max-width: 450px;"
      >
      </v-text-field>
      <button style="display: none" v-shortkey.once="['ctrl', 'k']" @shortkey="$store.commit('setSearch', true)">Debug</button>
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
              <v-icon v-if="!$store.state.user.avatar">mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
              v-for="(item, index) in menus.dropdownAuthenticated"
              :key="item.id"
              :disabled="item.disabled"
              :to="item.path"
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
          <template v-if="$store.state.user.moderator || $store.state.user.admin">
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
        color="#151515"
        floating
    >
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

              <v-list-item to="/user">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Your Profile</v-list-item-title>
              </v-list-item>

              <v-list-group
                  prepend-icon="mdi-pen"
              >
                <template v-slot:activator>
                  <v-list-item-title>Curriculum</v-list-item-title>
                </template>

                <v-list-group
                    no-action
                    sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>Pages</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item
                      link
                      to="/user/tasks"
                  >
                    <v-list-item-title>Learning Tasks</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                      link
                      to="/school/resources"
                  >
                    <v-list-item-title>School Resources</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                      link
                      to="/user/subjects"
                  >
                    <v-list-item-title>View all Subjects</v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-list-group
                    no-action
                    sub-group
                >
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
                    <v-list-item-title>{{subject.subjectLongName}}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
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
            click() {
              this.$store.commit("showSettings", true);
            },
            icon: "mdi-settings"
          },
          {
            id: 8,
            name: "Logout",
            click() {
              this.$store.dispatch("logout")
            },
            icon: "mdi-settings"
          },
        ],
        debug: [
          {
            id: 2,
            name: "Debug",
            path: "/debug",
            icon: "mdi-bug",
            preview: false
          }
        ],
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
  methods: {
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
    if(this.$vuetify.breakpoint.mobile) {
      this.drawer = false
    }
  }
}
</script>

<style scoped>

</style>