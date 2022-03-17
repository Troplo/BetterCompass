<template>
  <div id="header">
    <v-app-bar app>
      <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="$vuetify.breakpoint.mobile"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
          class="troplo-title"
          @click="$router.push('/')"
          style="cursor: pointer"
      >BetterCompass</v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app
        color="#151515"
        floating
    >
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list v-if="$store.state.user">
          <v-list>
            <template>
              <v-list-item
                  class="ml-1"
                  style="text-transform: unset !important"
                  text
                  v-for="(item, index) in menus.authenticated"
                  :key="item.id"
                  :href="item.externalPath"
                  :to="item.path"
                  link
                  :color="active(item.name)"
                  @click="handleClick(index)"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }} </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                  >{{ item.name }}
                    <v-chip
                        v-if="item.new"
                        class="ma-2"
                        color="green"
                        outlined
                        x-small
                    >
                      NEW
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
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
      drawer: true,
      menus: {
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
  }
}
</script>

<style scoped>

</style>