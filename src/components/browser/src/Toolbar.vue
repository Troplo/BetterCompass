<template>
  <v-toolbar color="dark" dense flat>
    <v-toolbar-items>
      <v-menu v-if="storages.length > 1" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="storage-select-button mr-3 rounded-xl" icon v-on="on">
            <v-icon>mdi-arrow-down-drop-circle</v-icon>
          </v-btn>
        </template>
        <v-list class="storage-select-list">
          <v-list-item
            v-for="(item, index) in storages"
            :key="index"
            :disabled="item.code === storageObject.code"
            @click="changeStorage(item.code)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        class="rounded-xl"
        :input-value="path === '/'"
        text
        @click="changePath('/')"
      >
        <v-icon class="mr-2">{{ storageObject.icon }}</v-icon>
        {{ storageObject.name }}
      </v-btn>
      <template v-for="(segment, index) in pathSegments">
        <v-icon :key="index + '-icon'">mdi-chevron-right</v-icon>
        <v-btn
          class="rounded-xl"
          :key="index + '-btn'"
          :input-value="index === pathSegments.length - 1"
          text
          @click="changePath(segment.path)"
          >{{ segment.name }}
        </v-btn>
      </template>
    </v-toolbar-items>
    <div class="flex-grow-1"></div>
    <template v-if="$vuetify.breakpoint.smAndUp">
      <v-tooltip v-if="pathSegments.length > 0" bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="rounded-xl" icon @click="goUp" v-on="on">
            <v-icon>mdi-arrow-up-bold-outline</v-icon>
          </v-btn>
        </template>
        <span v-if="pathSegments.length === 1">Up to "root"</span>
        <span v-else
          >Up to "{{ pathSegments[pathSegments.length - 2].name }}"</span
        >
      </v-tooltip>
      <v-menu
        v-if="path"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="rounded-xl"
            icon
            title="Create Folder"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-folder-plus-outline</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              class="rounded-xl"
              v-model="newFolderName"
              hide-details
              label="Name"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn class="rounded-xl" depressed @click="newFolder = false"
              >Cancel</v-btn
            >
            <v-btn
              class="rounded-xl"
              :disabled="!newFolderName"
              :loading="newFolderLoading"
              color="primary"
              depressed
              >Create Folder
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        class="rounded-xl"
        v-if="path"
        icon
        title="Upload Files"
        @click="$refs.inputUpload.click()"
      >
        <v-icon>mdi-plus-circle</v-icon>
        <input
          v-show="false"
          ref="inputUpload"
          multiple
          type="file"
          @change="addFiles"
        />
      </v-btn>
    </template>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    storages: Array,
    storage: String,
    path: String,
    id: BigInt,
    endpoints: Object
  },
  data() {
    return {
      newFolder: false,
      newFolderLoading: false,
      newFolderName: ""
    }
  },
  computed: {
    pathSegments() {
      let path = "/",
        segments = this.path.split("/").filter((item) => item)
      segments = segments.map((item, index) => {
        path += item + (index < segments.length - 1 || "/")
        console.log({       name: item,
          path})
        return {
          name: item,
          path
        }
      })
      return segments
    },
    storageObject() {
      return this.storages.find((item) => item.code === this.storage)
    }
  },
  methods: {
    changeStorage(code) {
      if (this.storage !== code) {
        this.$emit("storage-changed", code)
        this.$emit("path-changed", "")
      }
    },
    changePath(path) {
      console.log("/" + path.replaceAll(" ", "-").toLowerCase())
      this.$emit("path-changed", "/" + path.replaceAll(" ", "-").toLowerCase())
    },
    goUp() {
      let segments = this.pathSegments,
        path = segments.length === 1 ? "/" : segments[segments.length - 2].path
      this.changePath(path)
    },
    async addFiles(event) {
      this.$emit("add-files", event.target.files)
      this.$refs.inputUpload.value = ""
    },
  }
}
</script>

<style lang="scss" scoped>
.storage-select-list .v-list-item--disabled {
  background-color: rgba(0, 0, 0, 0.25);
  color: #ffffff;

  .v-icon {
    color: #ffffff;
  }
}
</style>
