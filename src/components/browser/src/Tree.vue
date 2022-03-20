<template>
  <v-card
    class="d-flex flex-column folders-tree-card"
    flat
    min-height="380"
    tile
    width="250"
  >
    <div class="grow scroll-x">
      <v-treeview
        :active="active"
        :items="items"
        :load-children="readFolder"
        :open="open"
        :search="filter"
        activatable
        class="folders-tree"
        dense
        item-key="path"
        item-text="name"
        transition
        v-on:update:active="activeChanged"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.content"
            >{{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else
            >{{ icons[calculateExtension(item)] || icons["other"] }}
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          {{ item.name }}
          <v-btn
            v-if="item.type === 'dir'"
            class="ml-1 rounded-xl"
            icon
            @click.stop="readFolder(item)"
          >
            <v-icon class="pa-0 mdi-18px" color="grey lighten-1"
              >mdi-refresh
            </v-icon>
          </v-btn>
        </template>
      </v-treeview>
    </div>
    <v-divider></v-divider>
    <v-toolbar class="shrink" color="dark" dense flat>
      <v-text-field
        v-model="filter"
        class="ml-n3 rounded-xl"
        color="dark"
        flat
        hide-details
        label="Filter"
        prepend-inner-icon="mdi-filter"
        solo
      ></v-text-field>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn class="rounded-xl" icon @click="init" v-on="on">
            <v-icon>mdi-collapse-all</v-icon>
          </v-btn>
        </template>
        <span>Collapse All</span>
      </v-tooltip>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  props: {
    icons: Object,
    storage: String,
    path: String,
    endpoints: Object,
    refreshPending: Boolean
  },
  data() {
    return {
      open: [],
      active: [],
      items: [],
      filter: ""
    }
  },
  methods: {
    calculateExtension(item) {
      let ext = /(?:\.([^.]+))?$/
      return ext.exec(item.attachment.toLowerCase())
    },
    init() {
      this.open = []
      this.items = []
      // set default files tree items (root item) in nextTick.
      // Otherwise this.open isn't cleared properly (due to syncing perhaps)
      setTimeout(() => {
        this.items = [
          {
            type: "dir",
            path: "/",
            name: "root",
            extension: "",
            children: []
          }
        ]
      }, 0)
      if (this.path !== "") {
        this.$emit("path-changed", "")
      }
    },
    async readFolder(item) {
      this.$emit("loading", true)
      console.log(1234)

      // eslint-disable-next-line require-atomic-updates
      item.children.map((item) => {
        if (item.type === "dir") {
          item.children = []
        }
        return item
      })

      this.$emit("loading", false)
    },
    activeChanged(active) {
      this.active = active
      let path = ""
      if (active.length) {
        path = active[0]
      }
      if (this.path !== path) {
        this.$emit("path-changed", path)
      }
    },
    findItem(path) {
      console.log(69)
      let stack = []
      stack.push(this.items[0])
      while (stack.length > 0) {
        let node = stack.pop()
        if (node.path === path) {
          return node
        } else if (node.children && node.children.length) {
          for (let i = 0; i < node.children.length; i++) {
            stack.push(node.children[i])
          }
        }
      }
      return null
    }
  },
  watch: {
    storage() {
      this.init()
    },
    path() {
      this.active = [this.path]
      if (!this.open.includes(this.path)) {
        this.open.push(this.path)
      }
      console.log(this.open)
    },
    async refreshPending() {
      if (this.refreshPending) {
        console.log(67)
        let item = this.findItem(this.path)
        await this.readFolder(item)
        this.$emit("refreshed")
      }
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.folders-tree-card {
  height: 100%;

  .scroll-x {
    overflow-x: auto;
  }

  ::v-deep .folders-tree {
    width: fit-content;
    min-width: 250px;

    .v-treeview-node {
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }
  }
}
</style>
