<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3">

          <v-app-bar flat color="rgba(0,0,0,0)">
            <v-btn class="rounded-xl" x-large block>
              New Conversation
            </v-btn>
          </v-app-bar>

          <v-app-bar flat color="card">
            <v-toolbar-title class="title">
              Communications
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn
                icon
            >
              <v-icon>fas fa-ellipsis-h</v-icon>
            </v-btn>
          </v-app-bar>

          <v-text-field
              class="ml-4"
              filled
              label="Search Here"
              append-icon="mdi-magnify"
              color="grey"
          ></v-text-field>

          <v-list two-line color="card">
            <v-list-item-group
                v-model="selected"
                active-class="blue lighten-4"
                multiple
            >
              <template v-for="(item, index) in items">
                <v-list-item :key="item.title">
                  <v-badge
                      bordered
                      bottom
                      color="green"
                      dot
                      offset-x="22"
                      offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>

                      <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
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
      items: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
          title: 'Ali Connors',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
          title: 'me, Scrott, Jennifer',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          subtitle: 'Do you have Paris recommendations? Have you ever been?',
          title: 'Sandra Adams',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          subtitle: 'Have any ideas about what we should get Heidi for her birthday?',
          title: 'Trevor Hansen',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
          title: 'Britta Holt',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
          title: 'Connors',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
          title: ' Jennifer',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          subtitle: 'Do you have Paris recommendations? Have you ever been?',
          title: 'Sandra ',
        },
      ],
      files: [
        { text: 'Landing_page.zip', icon: ' mdi-cloud-upload' },
        { text: 'Requirements.pdf', icon: ' mdi-cloud-upload' },
        { text: 'Uwagi.docx', icon: ' mdi-cloud-upload' },
      ],
      panel: [2],

      password: 'Password',
      show: false,
      message: 'Type a message here',
      marker: true,
      iconIndex: 0,
    }
  },
  methods: {
    sendMessage () {
      this.resetIcon()
      this.clearMessage()
    },
    clearMessage () {
      this.message = ''
    },
    resetIcon () {
      this.iconIndex = 0
    },
  }
}
</script>

<style scoped>

</style>