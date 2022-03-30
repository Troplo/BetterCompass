<template>
  <div v-if="$store.state.site.release === 'dev'">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3">
          <v-app-bar flat color="rgba(0,0,0,0)">
            <v-btn class="rounded-xl" x-large block> New Conversation </v-btn>
          </v-app-bar>

          <v-app-bar flat color="card">
            <v-toolbar-title class="title"> Communications </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>fas fa-ellipsis-h</v-icon>
            </v-btn>
          </v-app-bar>

          <v-text-field
            filled
            label="Search..."
            append-icon="mdi-magnify"
            color="grey"
          ></v-text-field>

          <v-list two-line color="card">
            <v-list-item-group
              v-model="selected"
              class="rounded-xl"

            >
              <template v-for="(item, index) in items">
                <v-list-item :key="item.title" :to="'/communications/' + item.id">
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    v-if="item.chat.type === 'direct'"
                    dot
                    offset-x="24"
                    offset-y="26"
                  >
                    <v-list-item-avatar :color="$vuetify.theme.themes.dark.primary">
                      <v-icon v-if="item.chat.type === 'group'">
                        mdi-account-group
                      </v-icon>
                      <v-icon v-if="item.chat.type === 'direct'">
                        mdi-account
                      </v-icon>
                    </v-list-item-avatar>
                  </v-badge>
                  <v-badge dot color="none" v-else>
                    <v-list-item-avatar :color="$vuetify.theme.themes.dark.primary">
                      <v-icon v-if="item.chat.type === 'group'">
                        mdi-account-group
                      </v-icon>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title v-if="item.chat.type === 'direct'">
                        {{item.chat.name}}
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        {{item.chat.name}}
                      </v-list-item-title>

                      <v-list-item-subtitle
                        v-if="item.chat.type === 'group'"
                      >
                        {{item.chat.users.length}} Members
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Communications",
  data() {
    return {
      selected: [2],
      items: [],
      files: [
        { text: "Landing_page.zip", icon: " mdi-cloud-upload" },
        { text: "Requirements.pdf", icon: " mdi-cloud-upload" },
        { text: "Uwagi.docx", icon: " mdi-cloud-upload" }
      ],
      panel: [2],

      password: "Password",
      show: false,
      message: "Type a message here",
      marker: true,
      iconIndex: 0
    }
  },
  methods: {
    sendMessage() {
      this.resetIcon()
      this.clearMessage()
    },
    clearMessage() {
      this.message = ""
    },
    resetIcon() {
      this.iconIndex = 0
    },
    getChats() {
      this.axios.get("/api/v1/communications").then(response => {
        this.items = response.data
      })
    }
  },
  mounted() {
    this.getChats()
  }
}
</script>

<style scoped></style>
