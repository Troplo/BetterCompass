<template>
  <div>
    <v-dialog v-model="createTheme" max-width="950px">
      <v-card color="card">
        <v-card-title>
          Theme {{ creatorType === "create" ? "Creator" : "Editor" }}
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-on="on" v-bind="attrs">
                <v-btn fab small text @click="randomizeTheme">
                  <v-icon>mdi-dice-multiple</v-icon>
                </v-btn>
              </div>
            </template>
            <span> Randomize theme </span>
          </v-tooltip>
        </v-card-title>
        <v-container>
          <v-form>
            <v-text-field
              v-model="creator.name"
              class="mx-3"
              label="Theme Name"
              required
            ></v-text-field>
            <v-select
              :items="intendedFor"
              label="Intended for"
              class="mx-3"
              v-model="creator.primaryType"
            >
            </v-select>
            <v-card-title>Dark:</v-card-title>
            <v-menu
              offset-y
              v-for="(item, index) in creator.dark"
              :key="index + '-dark'"
            >
              <template v-slot:activator="{ on }">
                <v-btn dark class="ma-1" :color="creator.dark[index]" v-on="on">
                  {{ index }}
                </v-btn>
              </template>
              <v-color-picker
                v-model="creator.dark[index]"
                hide-canvas
                hide-inputs
                show-swatches
                class="mx-auto"
              ></v-color-picker>
            </v-menu>
            <v-card-title>Light:</v-card-title>
            <v-menu
              offset-y
              v-for="(item, index) in creator.light"
              :key="index + '-light'"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  class="ma-1"
                  :color="creator.light[index]"
                  v-on="on"
                >
                  {{ index }}
                </v-btn>
              </template>
              <v-color-picker
                v-model="creator.light[index]"
                hide-canvas
                hide-inputs
                show-swatches
                class="mx-auto"
              ></v-color-picker>
            </v-menu>
          </v-form>
          <v-card-actions>
            <v-btn color="primary" text @click="doCreateTheme">{{
              creatorType === "create" ? "Create & Apply" : "Save Edits"
            }}</v-btn>
            <v-btn
              color="primary"
              text
              @click="doCreateTheme('copy')"
              v-if="creatorType === 'edit'"
              >Save a Copy</v-btn
            >
            <v-btn color="error darken-1" text @click="doDiscardTheme"
              >Discard</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createAccountDialog" max-width="950px">
      <v-card color="card">
        <v-card-title>
          <span class="headline">Create Account</span>
        </v-card-title>
        <v-card-text v-if="alternateCreationType">
          <p>
            This will create a BetterCompass account, you will be automatically
            logged in with it when logging into BetterCompass in addition to
            your normal Compass account.
          </p>
          <p>Information:</p>
          <ul>
            <li>
              When creating an account, a database object with your Compass
              username ({{ $store.state.user.username }}), ID ({{
                $store.state.user.userId
              }}), and Compass instance ({{ $store.state.school.instance }})
              will be created, along with your chosen settings.
            </li>
            <li>
              When logging in you'll be given a special BetterCompass
              authentication token which will grant you access to both
              BetterCompass Accounts, and Compass.
            </li>
            <li>
              Your original Compass session will never be sent to the client,
              instead mapped to the BetterCompass authentication token on the
              server.
            </li>
            <li>
              You'll have the ability to check recent logins, and invalidate
              BetterCompass sessions at your will.
            </li>
            <li>
              You'll also have the ability to set a custom token expiry time for
              security.
            </li>
            <li>
              You may delete your account at any time, which will delete all
              your data from the BetterCompass server, and you'll still be able
              to use BetterCompass with the original Compass-only authentication
              method.
            </li>
            <li>Your password will not be stored on the server.</li>
            <li>
              This authentication method will have many extended features and
              benefits in the future.
            </li>
          </ul>
          <v-checkbox v-model="agree">
            <template slot="label">
              I agree with the above information, and the&nbsp;<router-link
                to="/privacy"
                style="text-decoration: none"
              >
                privacy policy</router-link
              >.
            </template>
          </v-checkbox>
        </v-card-text>
        <v-card-text v-else>
          <p>This will create a BetterCompass account.</p>
          <p>Information:</p>
          <ul>
            <li>
              When creating an account, a database object with your Compass
              username ({{ $store.state.user.username }}), ID ({{
                $store.state.user.userId
              }}), and Compass instance ({{ $store.state.school.instance }})
              will be created, along with your chosen settings.
            </li>
            <li>
              When a request is made to a route that uses BetterCompass
              Accounts, it will authenticate with Compass using your session to
              validate authenticity on the server.
            </li>
            <li>
              Your session, and sensitive information will not be stored on the
              server.
            </li>
          </ul>
          <v-checkbox
            v-model="agree"
            label="I agree with the above information."
          >
          </v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="createAccountDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!agree"
            @click="createAccount"
          >
            Create Account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card color="card" class="rounded-xl" elevation="7">
      <v-toolbar color="toolbar">
        <v-toolbar-title>BetterCompass Settings</v-toolbar-title> </v-toolbar
      ><br />
      <v-alert type="info" class="mx-6" text>
        Your settings (including themes) now synchronize throughout all of your
        devices.
      </v-alert>
      <v-card-title>Email & Push Notifications</v-card-title>
      <v-card-text>
        <v-text-field v-model="$store.state.user.email" label="Compass Email" disabled></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-text-field v-model="$store.state.user.email" label="BetterCompass Email"></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          v-model="$store.state.user.bcUser.emailNotifications"
          inset
          label="Send email notifications for new learning tasks"
          color="info"
        ></v-switch>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          inset
          label="Send email notifications for learning task feedback responses"
          color="info"
        ></v-switch>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          inset
          label="Send email notifications for school news & announcement posts."
          color="info"
        ></v-switch>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          inset
          label="Send email notifications for room & teacher changes."
          color="info"
        ></v-switch>
      </v-card-text>
      <v-card-title>Website Settings</v-card-title>
      <v-card-text>
        <v-text-field v-model="$store.state.user.bcUser.discussionsImage" label="Avatar URL (override, only visible to you)" append-outer-icon="mdi-content-save" @click:append-outer="saveSettings" @keyup.enter="saveSettings"></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          v-model="$store.state.user.bcUser.learningTaskNotification"
          inset
          label="Show overdue learning task warning"
          color="warning"
        ></v-switch>
      </v-card-text>
      <v-card-text>
        <v-switch
          @change="saveSettings"
          v-model="$store.state.user.bcUser.weather"
          inset
          label="Show weather widget"
        ></v-switch>
      </v-card-text>
      <v-card-text v-if="debugModeEnabled">
        <v-alert type="error" text>
          Seizure warning.
        </v-alert>
        <v-slider
          v-model="slider"
          hint="Speed"
          max="2000"
          min="10"
        ></v-slider>
        <v-btn class="mr-2" @click="randomColorTheme()">
          Set
        </v-btn>
        <v-btn @click="stopColorTheme()">
          Stop
        </v-btn>
      </v-card-text>
      <v-card-text>
        <p>Minimize header events has been replaced.<br>You can now disable individual calendars via Calendar Settings on the homepage.</p>
      </v-card-text>
      <v-card-text v-if="this.$store.state.site.release === 'dev'">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <v-switch
                @change="saveSettings"
                v-model="$store.state.user.bcUser.cache"
                inset
                label="Offline caching"
              ></v-switch>
            </div>
          </template>
          <span>
            This will cache your calendar events, and user information for
            offline usage that is relevant for 2 weeks. (This may pose a
            privacy/security risk, as it is stored in your browser's local
            storage.)
          </span>
        </v-tooltip>
      </v-card-text>
      <v-card-text>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <v-switch
                @change="saveSettings"
                v-model="$store.state.user.bcUser.calendarAutoJump"
                inset
                label="Calendar Auto Jump"
              ></v-switch>
            </div>
          </template>
          <span> This will skip to Monday on Saturday and Sunday. </span>
        </v-tooltip>
      </v-card-text>
      <v-card-title>Theming and Personalization</v-card-title>
      <v-card-text>
        <v-switch
          v-model="$store.state.user.bcUser.theme"
          true-value="dark"
          false-value="light"
          @change="saveSettings"
          inset
          label="Dark theme"
        ></v-switch>
      </v-card-text>
      <v-alert
        v-if="
          ($vuetify.theme.themes.primaryType === 'light' &&
            $vuetify.theme.dark) ||
          ($vuetify.theme.themes.primaryType === 'dark' && !$vuetify.theme.dark)
        "
        class="mx-6"
        outlined
        type="warning"
      >
        You currently have a theme enabled that is not designed for your
        selected base theme.
      </v-alert>
      <v-card-text
        ><v-switch
          inset
          v-model="defineAccent"
          label="Use a custom accent color (overrides theme's primary attribute)."
        ></v-switch>
        <v-color-picker
          v-if="defineAccent"
          hide-canvas
          value="hex"
          hide-inputs
          show-swatches
          swatches-max-height="132"
          v-model="accent"
        ></v-color-picker>
      </v-card-text>
      <v-card-text>
        <v-card
          class="my-2"
          @click="setTheme(theme)"
          hover
          outlined
          v-for="(theme, index) in computeThemes"
          :key="index"
          color="card"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ theme.name }}
                <v-btn text fab small @click="download(theme)">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn
                  text
                  fab
                  small
                  @click="initEditTheme(theme)"
                  v-if="theme.userId === $store.state.user.bcUser.id"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  text
                  fab
                  small
                  @click="doDeleteTheme(theme)"
                  v-if="theme.userId === $store.state.user.bcUser.id"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn text fab small @click="doCreateTheme('copy', theme)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ theme.public ? "Public" : "Private" }}, created by
                {{ theme.user.sussiId }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-avatar color="success" size="30" v-if="name === theme.id">
                <v-icon>mdi-check</v-icon>
              </v-avatar>
            </v-list-item-action>
          </v-list-item>
          <div class="my-2" v-if="$vuetify.theme.dark">
            <v-chip-group>
              <v-chip
                class="mx-1"
                label
                :color="theme.dark[key]"
                v-for="(key, index) in Object.keys(theme.dark)"
                :key="index"
              >
                {{ key }}</v-chip
              >
            </v-chip-group>
          </div>
          <div class="my-2" v-if="!$vuetify.theme.dark">
            <v-chip-group column>
              <v-chip
                class="mx-1"
                label
                :color="theme.light[key]"
                v-for="(key, index) in Object.keys(theme.light)"
                :key="index"
              >
                {{ key }}</v-chip
              >
            </v-chip-group>
          </div>
        </v-card>
        <v-container class="text-center justify-center">
          <v-chip @click="initThemeCreator" x-large outlined fab
            ><v-icon x-large>mdi-plus</v-icon></v-chip
          >
        </v-container>
      </v-card-text>
      <div class="mx-6">
        <small
          >BetterCompass version {{ $store.state.versioning.version }}, built on
          {{ $store.state.versioning.date }}</small
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import AjaxErrorHandler from "@/lib/errorHandler"

export default {
  name: "Settings",
  data() {
    return {
      intendedFor: [
        { text: "All base themes", value: "all" },
        { text: "Dark theme", value: "dark" },
        { text: "Light theme", value: "light" }
      ],
      defineAccent: false,
      alternateCreationType: false,
      createAccountDialog: false,
      slider: 300,
      agree: false,
      loading: false,
      accent: null,
      creator: {
        id: 1,
        name: "",
        primaryType: "all",
        dark: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#ff1744",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#151515",
          toolbar: "#191919",
          sheet: "#181818",
          text: "#000000",
          dark: "#151515",
          bg: "#151515",
          calendarNormalActivity: "#3f51b5",
          calendarActivityType7: "#f44336",
          calendarActivityType8: "#4caf50",
          calendarActivityType10: "#ff9800",
          calendarExternalActivity: "#2196f3"
        },
        light: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#ff1744",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#f8f8f8",
          toolbar: "#f8f8f8",
          sheet: "#f8f8f8",
          text: "#000000",
          dark: "#f8f8f8",
          bg: "#f8f8f8",
          calendarNormalActivity: "#3f51b5",
          calendarActivityType7: "#f44336",
          calendarActivityType8: "#4caf50",
          calendarActivityType10: "#ff9800",
          calendarExternalActivity: "#2196f3"
        }
      },
      createTheme: false,
      name: "",
      creatorType: "create",
      themes: [],
      interval: null
    }
  },
  computed: {
    debugModeEnabled() {
      if(localStorage.getItem("debugModeEnabled")) {
        return JSON.parse(localStorage.getItem('debugModeEnabled'))
      } else {
        return false
      }
    },
    computeThemes() {
      let array = []
      if (this.$vuetify.theme.dark) {
        array = this.themes.filter(
          (theme) => theme.primaryType === "dark" || theme.primaryType === "all"
        )
        return array
      } else {
        array = this.themes.filter(
          (theme) =>
            theme.primaryType === "light" || theme.primaryType === "all"
        )
        return array
      }
    }
  },
  methods: {
    stopColorTheme() {
      clearInterval(this.interval)
    },
    randomColorTheme() {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.$vuetify.theme.themes.light = {
          primary: "#" + Math.floor(Math.random() * 16777215).toString(16),
          secondary: "#" + Math.floor(Math.random() * 16777215).toString(16),
          accent: "#" + Math.floor(Math.random() * 16777215).toString(16),
          error: "#" + Math.floor(Math.random() * 16777215).toString(16),
          info: "#" + Math.floor(Math.random() * 16777215).toString(16),
          success: "#" + Math.floor(Math.random() * 16777215).toString(16),
          warning: "#" + Math.floor(Math.random() * 16777215).toString(16),
          card: "#" + Math.floor(Math.random() * 16777215).toString(16),
          toolbar: "#" + Math.floor(Math.random() * 16777215).toString(16),
          sheet: "#" + Math.floor(Math.random() * 16777215).toString(16),
          text: "#" + Math.floor(Math.random() * 16777215).toString(16),
          dark: "#" + Math.floor(Math.random() * 16777215).toString(16),
          bg: "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarNormalActivity:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType7:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType8:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType10:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarExternalActivity: Math.floor(Math.random() * 16777215).toString(
            16
          )
        }
        this.$vuetify.theme.themes.dark = {
          primary: "#" + Math.floor(Math.random() * 16777215).toString(16),
          secondary: "#" + Math.floor(Math.random() * 16777215).toString(16),
          accent: "#" + Math.floor(Math.random() * 16777215).toString(16),
          error: "#" + Math.floor(Math.random() * 16777215).toString(16),
          info: "#" + Math.floor(Math.random() * 16777215).toString(16),
          success: "#" + Math.floor(Math.random() * 16777215).toString(16),
          warning: "#" + Math.floor(Math.random() * 16777215).toString(16),
          card: "#" + Math.floor(Math.random() * 16777215).toString(16),
          toolbar: "#" + Math.floor(Math.random() * 16777215).toString(16),
          sheet: "#" + Math.floor(Math.random() * 16777215).toString(16),
          text: "#" + Math.floor(Math.random() * 16777215).toString(16),
          dark: "#" + Math.floor(Math.random() * 16777215).toString(16),
          bg: "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarNormalActivity:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType7:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType8:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarActivityType10:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          calendarExternalActivity: Math.floor(Math.random() * 16777215).toString(
            16
          )
        }
      }, this.slider)
    },
    randomizeTheme() {
      this.creator.light = {
        primary: "#" + Math.floor(Math.random() * 16777215).toString(16),
        secondary: "#" + Math.floor(Math.random() * 16777215).toString(16),
        accent: "#" + Math.floor(Math.random() * 16777215).toString(16),
        error: "#" + Math.floor(Math.random() * 16777215).toString(16),
        info: "#" + Math.floor(Math.random() * 16777215).toString(16),
        success: "#" + Math.floor(Math.random() * 16777215).toString(16),
        warning: "#" + Math.floor(Math.random() * 16777215).toString(16),
        card: "#" + Math.floor(Math.random() * 16777215).toString(16),
        toolbar: "#" + Math.floor(Math.random() * 16777215).toString(16),
        sheet: "#" + Math.floor(Math.random() * 16777215).toString(16),
        text: "#" + Math.floor(Math.random() * 16777215).toString(16),
        dark: "#" + Math.floor(Math.random() * 16777215).toString(16),
        bg: "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarNormalActivity:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType7:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType8:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType10:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarExternalActivity: Math.floor(Math.random() * 16777215).toString(
          16
        )
      }
      this.creator.dark = {
        primary: "#" + Math.floor(Math.random() * 16777215).toString(16),
        secondary: "#" + Math.floor(Math.random() * 16777215).toString(16),
        accent: "#" + Math.floor(Math.random() * 16777215).toString(16),
        error: "#" + Math.floor(Math.random() * 16777215).toString(16),
        info: "#" + Math.floor(Math.random() * 16777215).toString(16),
        success: "#" + Math.floor(Math.random() * 16777215).toString(16),
        warning: "#" + Math.floor(Math.random() * 16777215).toString(16),
        card: "#" + Math.floor(Math.random() * 16777215).toString(16),
        toolbar: "#" + Math.floor(Math.random() * 16777215).toString(16),
        sheet: "#" + Math.floor(Math.random() * 16777215).toString(16),
        text: "#" + Math.floor(Math.random() * 16777215).toString(16),
        dark: "#" + Math.floor(Math.random() * 16777215).toString(16),
        bg: "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarNormalActivity:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType7:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType8:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarActivityType10:
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        calendarExternalActivity: Math.floor(Math.random() * 16777215).toString(
          16
        )
      }
    },
    doDeleteTheme(theme) {
      this.axios
        .delete("/api/v1/themes/" + theme.id)
        .then(() => {
          this.$store.dispatch("getUserInfo")
          this.getThemes()
        })
        .catch((e) => {
          AjaxErrorHandler(e)
        })
    },
    getThemes() {
      this.axios.get("/api/v1/themes").then((res) => {
        this.themes = res.data.map((theme) => {
          return {
            id: theme.id,
            name: theme.name,
            primaryType: theme.theme.primaryType,
            dark: theme.theme.dark,
            light: theme.theme.light,
            public: theme.public,
            user: theme.user,
            userId: theme.userId
          }
        })
      })
    },
    doCreateTheme(type, theme) {
      if (this.creatorType === "create" || type === "copy") {
        this.axios
          .post("/api/v1/themes", {
            name:
              type === "copy"
                ? theme?.name + " - Copy" || this.creator.name + " - Copy"
                : this.creator.name,
            theme: theme || this.creator
          })
          .then(() => {
            this.getThemes()
            this.doDiscardTheme()
          })
          .catch((e) => {
            AjaxErrorHandler(this.$store)(e)
          })
      } else {
        this.axios
          .put("/api/v1/themes/" + this.creator.id, {
            name: this.creator.name,
            theme: this.creator
          })
          .then(() => {
            this.getThemes()
            this.doDiscardTheme()
          })
          .catch((e) => {
            AjaxErrorHandler(this.$store)(e)
          })
      }
    },
    initEditTheme(theme) {
      this.creator = theme
      this.creatorType = "edit"
      this.createTheme = true
    },
    doDiscardTheme() {
      this.creator = {
        id: 1,
        name: "BetterCompass Classic",
        primaryType: "all",
        dark: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#ff1744",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#151515",
          toolbar: "#191919",
          sheet: "#181818",
          text: "#000000",
          dark: "#151515",
          bg: "#151515",
          calendarNormalActivity: "#3f51b5",
          calendarActivityType7: "#f44336",
          calendarActivityType8: "#4caf50",
          calendarActivityType10: "#ff9800",
          calendarExternalActivity: "#2196f3"
        },
        light: {
          primary: "#0190ea",
          secondary: "#757575",
          accent: "#000000",
          error: "#ff1744",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#ff9800",
          card: "#f8f8f8",
          toolbar: "#f8f8f8",
          sheet: "#f8f8f8",
          text: "#000000",
          dark: "#f8f8f8",
          bg: "#f8f8f8",
          calendarNormalActivity: "#3f51b5",
          calendarActivityType7: "#f44336",
          calendarActivityType8: "#4caf50",
          calendarActivityType10: "#ff9800",
          calendarExternalActivity: "#2196f3"
        }
      }
      this.creatorType = "create"
      this.createTheme = false
    },
    initThemeCreator() {
      this.creatorType = "create"
      this.createTheme = true
    },
    download(theme) {
      const data = JSON.stringify(theme)
      const blob = new Blob([data], { type: "text/plain" })
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a")
      a.download = theme.name + " - BetterCompass Theme.json"
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":")
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      a.dispatchEvent(e)
    },
    setTheme(theme) {
      const name = theme.id
      const dark = theme.dark
      const light = theme.light
      this.$vuetify.theme.themes.dark = dark
      this.$vuetify.theme.themes.light = light
      this.$vuetify.theme.themes.name = name
      this.$vuetify.theme.themes.primaryType = theme.primaryType
      if (this.accent && this.defineAccent) {
        this.$vuetify.theme.themes.light.primary = this.accent
        this.$vuetify.theme.themes.dark.primary = this.accent
        this.$store.state.user.bcUser.accentColor = this.accent
      } else {
        this.$store.state.user.bcUser.accentColor = null
      }
      this.name = name
      this.axios
        .put("/api/v1/user/settings/theme", {
          id: name,
          accent: this.defineAccent ? this.accent : null
        })
        .catch((e) => {
          AjaxErrorHandler(this.$store)(e)
        })
    },
    createAccount() {
      if (this.agree) {
        this.loading = true
        this.axios
          .post("/api/v1/user/create", {
            settings: this.settings
          })
          .then((res) => {
            this.$store.commit("setBetterCompassUser", res.data.user)
            this.createAccountDialog = false
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
            AjaxErrorHandler(this.$store)(e)
          })
      }
    },
    saveSettings() {
      this.loading = true
      this.$vuetify.theme.dark = this.$store.state.user.bcUser?.theme === "dark"

      this.$store
        .dispatch("saveOnlineSettings")
        .then(() => {
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          AjaxErrorHandler(this.$store)(e)
        })
    }
  },
  mounted() {
    this.defineAccent = this.$store.state.user.bcUser?.accentColor !== null
    this.accent = this.$store.state.user.bcUser?.accentColor
    this.name = this.$vuetify.theme.themes.name
    this.getThemes()
  },
  watch: {
    accent() {
      this.setTheme(
        this.themes.find(
          (theme) => theme.id === this.$vuetify.theme.themes.name
        )
      )
    },
    defineAccent() {
      if (!this.defineAccent) {
        this.accent = null
        this.setTheme(
          this.themes.find(
            (theme) => theme.id === this.$vuetify.theme.themes.name
          )
        )
      } else {
        this.accent = this.$store.state.user.bcUser?.accentColor || "#0190ea"
      }
    },
    "$store.state.user.bcUser.theme": {
      handler() {
        this.$vuetify.theme.dark = this.$store.state.user.bcUser.theme === "dark"
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
