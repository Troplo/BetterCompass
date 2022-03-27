<template>
  <div>
    <v-container>
      <v-card color="card" elevation="7" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            Resources
          </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row
              class="pa-4"
              justify="space-between"
          >
            <v-col cols="5">
              <v-treeview
                  :active.sync="active"
                  :items="resources.children"
                  :open.sync="open"
                  activatable
                  open-on-click
                  transition
                  return-object
              >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children.length">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                  </v-icon>
                  <v-icon v-else-if="item.content.filename">
                    {{ files[item.content.filename.split('.').pop()] || "mdi-file-outline" }}
                  </v-icon>
                  <v-icon v-else>
                    mdi-file-outline
                  </v-icon>
                </template>
              </v-treeview>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col
                class="d-flex text-center"
            >
              <div
                  v-if="!selected"
                  class="text-h6 grey--text text--lighten-1 font-weight-light"
                  style="align-self: center;"
              >
                Please select an item.
              </div>
              <v-card
                  v-else
                  :key="selected.id"
                  class="mx-auto"
                  color="card"
                  flat
              >
                <template v-if="selected.type === 2">
                  <v-card-title>
                    <div class="headline">
                      {{ selected.name }}
                    </div>
                  </v-card-title>
                  <html v-html="cleanLessonPlan"></html>
                </template>
                <template v-else>
                  <v-card-text>
                    <v-icon x-large v-if="selected.children.length">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon x-large v-else-if="selected.content.filename">
                      {{ files[selected.content.filename.split('.').pop()] }}
                    </v-icon>
                    <v-icon x-large v-else>
                      mdi-file-outline
                    </v-icon>
                    <h3 class="text-h5 mb-2">
                      {{ selected.name }}
                    </h3>
                    <small class="mb-2">
                      {{ selected.content.filename }}
                    </small>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-btn color="info" text :href="'/Services/FileAssets.svc/DownloadFile?id=' + selected.content.fileAssetId + '&originalFileName=' + selected.content.filename + '&forceInstance=' + $store.state.school.instance">
                      <v-icon>mdi-download</v-icon>
                      Download
                    </v-btn>
                  </v-card-text>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ActivityResources",
  props: ["activity", "resources"],
  data() {
    return {
      active: [],
      open: [],
      lessonPlan: "<p>Loading...</p>",
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf-box',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        xlsx: 'mdi-file-excel',
        zip: 'mdi-file-zip',
        doc: 'mdi-file-document-outline',
        docx: 'mdi-file-document-outline',
        ppt: 'mdi-file-powerpoint',
        pptx: 'mdi-file-powerpoint',
        mp3: 'mdi-file-music',
        mp4: 'mdi-file-video',
        avi: 'mdi-file-video',
        m4v: 'mdi-file-video',
        mpg: 'mdi-file-video',
        mpeg: 'mdi-file-video',
        mpe: 'mdi-file-video',
        m2v: 'mdi-file-video',
        other: 'mdi-file-outline',
      },
    }
  },
  computed: {
    selected () {
      if (!this.active.length) return undefined
      return this.active[0]
    },
    cleanLessonPlan() {
      return this.$sanitize(this.lessonPlan);
    }
  },
  watch: {
    selected() {
      if(this.selected.type === 2) {
        this.lessonPlan = "<p>Loading...</p>";
        this.axios.get(`/Services/FileAssets.svc/DownloadFile?sessionstate=readonly&id=${this.selected.content.fileAssetId}&nodeId=${this.selected.parentNodeId}`).then((res) => {
          this.lessonPlan = res.data
              .replaceAll(/https:(.*)\.compass\.education/g, "")
              .replaceAll(`<img src="/Services/FileAssets.svc/DownloadFile?`, `<img src="/Services/FileAssets.svc/DownloadFile?forceInstance=${this.$store.state.school.instance}&`)
              .replaceAll(`<a href="/Services/FileAssets.svc/DownloadFile?`, `<a href="/Services/FileAssets.svc/DownloadFile?forceInstance=${this.$store.state.school.instance}&`)
        }).catch(() => {
          this.lessonPlan = "<p>No lesson plan has been uploaded yet.</p>";
        })
      }
    }
  }
}
</script>

<style scoped>

</style>