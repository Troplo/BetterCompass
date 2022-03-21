<template>
  <v-card class="d-flex flex-column" flat min-height="380" tile>
    <confirm ref="confirm"></confirm>
    <v-card-text
      v-if="!path"
      class="grow d-flex justify-center align-center grey--text"
      >Select a folder or a file
    </v-card-text>
    <v-card-text
      v-else-if="isFile"
      class="grow d-flex justify-center align-center"
      >File: {{ path }}
    </v-card-text>
    <v-card-text v-else-if="dirs.length || files.length" class="grow">
      <v-list v-if="dirs.length" subheader>
        <v-subheader>Folders</v-subheader>
        <v-list-item
          v-for="item in dirs"
          :key="item.id"
          class="pl-0"
          @click="changePath(item.id)"
        >
          <v-list-item-avatar class="ma-0">
            <v-icon>mdi-folder</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="py-2">
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn class="rounded-xl" v-if="false" icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider v-if="dirs.length && files.length"></v-divider>
      <v-list v-if="files.length" subheader>
        <v-subheader>Files</v-subheader>
        <v-list-item
          v-for="item in files"
          :key="item.id"
          class="pl-0"
          @click="downloadItem(item)"
        >
          <v-list-item-avatar class="ma-0">
            <v-icon
              >{{ icons[calculateExtension(item)[1]] || icons["other"] }}
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content class="py-2">
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle
              >{{ fileTypes[calculateExtension(item)[1]] || fileTypes["other"] }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn class="rounded-xl" icon @click.stop="downloadItem(item)">
              <v-icon color="grey lighten-1">mdi-download</v-icon>
            </v-btn>
            <v-btn class="rounded-xl" v-if="false" icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text
      v-else-if="filter"
      class="grow d-flex justify-center align-center grey--text py-5"
      >No files or folders found
    </v-card-text>
    <v-card-text
      v-else
      class="grow d-flex justify-center align-center grey--text py-5"
      >This folder is empty.
    </v-card-text>
    <v-divider v-if="path"></v-divider>
    <v-toolbar v-if="path && isDir" class="shrink" color="dark" dense flat>
      <v-text-field
        v-model="filter"
        class="ml-n3 rounded-xl"
        flat
        hide-details
        label="Filter"
        prepend-inner-icon="mdi-filter"
        solo
      ></v-text-field>
      <v-btn class="rounded-xl" v-if="false" icon>
        <v-icon>mdi-eye-settings</v-icon>
      </v-btn>
      <v-btn class="rounded-xl" icon @click="load">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { formatBytes } from "./util"
import Confirm from "./Confirm.vue"

export default {
  props: {
    icons: Object,
    fileTypes: Object,
    storage: String,
    path: String,
    endpoints: Object,
    refreshPending: Boolean,
    resources: Object,
    activity: Object,
  },
  components: {
    Confirm
  },
  data() {
    return {
      items: [],
      filter: ""
    }
  },
  computed: {
    dirs() {
      return this.items.filter(
        (item) => !item.content && item.name.includes(this.filter)
      )
    },
    files() {
      return this.items.filter(
        (item) => item.content && item.name.includes(this.filter)
      )
    },
    isDir() {
      return true
    },
    isFile() {
      return !this.isDir
    }
  },
  methods: {
    calculateExtension(item) {
      try {
        let ext = /(?:\.([^.]+))?$/
        console.log(item.content.filename)
        console.log(ext.exec(item.content.filename.toLowerCase()))
        return ext.exec(item.content.filename.toLowerCase())
      } catch {
        return "other"
      }
    },
    formatBytes,
    changePath(path) {
      console.log("/" + path)
      this.$emit("path-changed", "/" + path)
    },
    async load() {
      this.$emit("loading", true)
      console.log("Load Requested")
      if(this.path === "/" || this.path === "//") {
        this.items = this.resources.children
      } else {
        this.items = this.resources.children[this.resources.children.findIndex(x => x.id === this.path.replace("/", ""))].children
      }
      this.$emit("loading", false)
    },
    async downloadItem(item) {
      let url = this.endpoints.download.url
        .replace(new RegExp("{storage}", "g"), this.storage)
        .replace(new RegExp("{path}", "g"), item.path)

      window.location.href = url
    }
  },
  watch: {
    async path() {
      this.items = []
      await this.load()
    },
    async refreshPending() {
      if (this.refreshPending) {
        await this.load()
        this.$emit("refreshed")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
}
</style>
