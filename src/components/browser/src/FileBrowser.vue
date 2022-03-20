<template>
  <v-card :loading="loading > 0" class="mx-auto">
    <toolbar
      :path="path"
      :storage="activeStorage"
      :storages="storagesArray"
      :resources="resources"
      :activity="activity"
      v-on:storage-changed="storageChanged"
      v-on:path-changed="pathChanged"
      v-on:add-files="addUploadingFiles"
      v-on:folder-created="refreshPending = true"
    ></toolbar>
    <v-row no-gutters>
      <v-col v-if="tree && $vuetify.breakpoint.smAndUp" sm="auto">
        <tree
          :icons="icons"
          :path="path"
          :refreshPending="refreshPending"
          :storage="activeStorage"
          :resources="resources"
          :activity="activity"
          v-on:loading="loadingChanged"
          v-on:refreshed="refreshPending = false"
          v-on:path-changed="pathChanged"
        ></tree>
      </v-col>
      <v-divider v-if="tree" vertical></v-divider>
      <v-col>
        <list
          :fileTypes="fileTypes"
          :icons="icons"
          :path="path"
          :refreshPending="refreshPending"
          :storage="activeStorage"
          :resources="resources"
          :activity="activity"
          v-on:loading="loadingChanged"
          v-on:refreshed="refreshPending = false"
          v-on:path-changed="pathChanged"
          v-on:file-deleted="refreshPending = true"
        ></list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Toolbar from "./Toolbar.vue"
import Tree from "./Tree.vue"
import List from "./List.vue"

const availableStorages = [
  {
    name: "Compass",
    code: "local",
    icon: "mdi-folder-multiple"
  }
]

const fileTypes = {
  wlu: "Compiled World Loading Unit",
  domino: "Blackbox Domino Document",
  lua: "Compiled Domino File",
  metadata: "Metadata Service File",
  lmetadata: "Metadata Service File",
  dep: "Metadata Dependency File",
  markup: "Markup Resource",
  skeleton: "Skeleton Resource",
  sdat: "Compiled Sector Resource",
  bik: "Compiled Bink Resource",
  biklight: "Compiled BinkLight Resource",
  workspace: "BlackBox Workspace Document",
  seq: "Sequence Resource",
  cseq: "Compiled Sequence Resource",
  road: "Compiled Road Resource",
  groad: "Road Resource",
  xml: "XML Document",
  rml: "Compiled XML Document",
  batch: "Batch Resource",
  cbatch: "Compiled Batch Resource",
  spt: "Compiled SpawningPoint Resource",
  bnk: "Compiled Sound Resource",
  pma: "Plasma MAD Resource",
  pmr: "Compiled Plasma MAD Resource",
  strategy: "Alive Strategy Template Resource",
  png: "Texture Resource",
  xbt: "Texture Resource",
  dds: "Texture Resource",
  dll: "Dynamic Link Library File",
  lib: "Compiled Database Library File",
  log: "Log File",
  other: "Generic/Unknown File",
  nfo: "Filelist for BigFile",
  dat: "Data for BigFile",
  fat: "FAT for BigFile",
  p4config: "Perforce Configuration File",
  txt: "Text File",
  fragment: "Oasis Fragment File",
  pdf: "PDF Document",
}

const fileIcons = {
  zip: "mdi-folder-zip-outline",
  rar: "mdi-folder-zip-outline",
  htm: "mdi-language-html5",
  html: "mdi-language-html5",
  js: "mdi-nodejs",
  json: "mdi-json",
  md: "mdi-markdown",
  pdf: "mdi-file-pdf-box",
  png: "mdi-file-image",
  jpg: "mdi-file-image",
  jpeg: "mdi-file-image",
  mp4: "mdi-filmstrip",
  mkv: "mdi-filmstrip",
  avi: "mdi-filmstrip",
  wmv: "mdi-filmstrip",
  mov: "mdi-filmstrip",
  txt: "mdi-file-document-outline",
  xls: "mdi-file-excel",
  other: "mdi-file-outline",
}

export default {
  components: {
    Toolbar,
    Tree,
    List
  },
  model: {
    prop: "path",
    event: "change"
  },
  props: {
    // comma-separated list of active storage codes
    storages: {
      type: String,
      default: () => availableStorages.map((item) => item.code).join(",")
    },
    // code of default storage
    storage: { type: String, default: "local" },
    // show tree view
    tree: { type: Boolean, default: true },
    // set Dunia/Disrupt file types
    fileTypes: { type: Object, default: () => fileTypes },
    // file icons set
    icons: { type: Object, default: () => fileIcons },
    // custom axios instance
    axios: { type: Function },
    // custom configuration for internal axios instance
    resources: {},
    activity: {}
  },
  data() {
    return {
      loading: 0,
      path: "",
      id: null,
      activeStorage: null,
      uploadingFiles: false, // or an Array of files
      refreshPending: false,
      axiosInstance: null
    }
  },
  computed: {
    storagesArray() {
      let storageCodes = this.storages.split(","),
        result = []
      storageCodes.forEach((code) => {
        result.push(availableStorages.find((item) => item.code === code))
      })
      return result
    }
  },
  methods: {
    loadingChanged(loading) {
      if (loading) {
        this.loading++
      } else if (this.loading > 0) {
        this.loading--
      }
    },
    storageChanged(storage) {
      this.activeStorage = storage
    },
    addUploadingFiles(files) {
      files = Array.from(files)

      if (this.maxUploadFileSize) {
        files = files.filter((file) => file.size <= this.maxUploadFileSize)
      }

      if (this.uploadingFiles === false) {
        this.uploadingFiles = []
      }

      if (
        this.maxUploadFilesCount &&
        this.uploadingFiles.length + files.length > this.maxUploadFilesCount
      ) {
        files = files.slice(
          0,
          this.maxUploadFilesCount - this.uploadingFiles.length
        )
      }

      this.uploadingFiles.push(...files)
    },
    removeUploadingFile(index) {
      this.uploadingFiles.splice(index, 1)
    },
    uploaded() {
      this.uploadingFiles = false
      this.refreshPending = true
    },
    pathChanged(path) {
      console.log(path)
      this.path = path
      this.$emit("change", path)
    }
  },
  created() {
    this.activeStorage = this.storage
  },
  mounted() {
    if (!this.path && !(this.tree && this.$vuetify.breakpoint.smAndUp)) {
      this.pathChanged("/")
    }
  }
}
</script>

<style lang="scss" scoped></style>
