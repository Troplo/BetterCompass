<template>
  <div>
    <v-dialog v-model="create.dialog" max-width="600px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title> CompassIdentity Creation </v-toolbar-title>
        </v-toolbar>
        <v-container>
          <p>
            From here you may activate a new CompassIdentity card, or update an
            existing one.
          </p>
          <v-text-field
            v-model="create.rfid"
            label="RFID"
            required
          ></v-text-field>
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :return-value.sync="create.activationDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="create.activationDate"
                label="Activation date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="create.activationDate"
              no-title
              scrollable
              color="primary"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu2 = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu2.save(create.activationDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="create.expirationDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="create.expirationDate"
                label="Expiration date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="create.expirationDate"
              no-title
              scrollable
              color="primary"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(create.expirationDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="create.dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              create.dialog = false
              createCard()
            "
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="rounded-xl" color="card">
      <v-toolbar color="toolbar">
        <v-toolbar-title> RFID CompassIdentity Card </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title> Ordering a new CompassIdentity card </v-card-title>
        <v-card-text>
          If you wish, you may order a new CompassIdentity card
          <a
            :href="
              'https://' +
              $store.state.school.instance +
              '.compass.education/Records/CompassIdentityCardManagement.aspx'
            "
            target="_blank"
            >here</a
          >
          (this will take you to regular Compass to make the order).<br />Replacement
          cards cost $10.
        </v-card-text>
        <v-alert type="warning" v-model="warning" text>
          This page may contain sensitive information, such as your raw RFID
          card number. Do you wish to continue?<br />
          <v-btn color="warning" text @click="warning = false"
            >Agree & Continue</v-btn
          >
        </v-alert>
        <v-data-table
          v-if="!warning"
          :items="rfid"
          :headers="headers"
          :style="
            'background-color: ' +
            $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].card
          "
        >
        </v-data-table>
        <v-btn
          v-if="!warning && $store.state.user.isJdlf"
          color="primary"
          text
          @click="create.dialog = true"
          >Create new CompassIdentity Card</v-btn
        >
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "UserIdentity",
  props: ["user"],
  data() {
    return {
      rfid: [],
      warning: true,
      menu: false,
      menu2: false,
      create: {
        rfid: "",
        activationDate: this.$date().format("YYYY-MM-DD"),
        expirationDate: this.$date().add(1, "year").format("YYYY-MM-DD"),
        dialog: false
      },
      headers: [
        {
          text: "RFID",
          value: "rfid"
        },
        {
          text: "Reversed RFID",
          value: "rfidReversed"
        },
        {
          text: "Activation Date",
          value: "activation"
        },
        {
          text: "Expiry Date",
          value: "expiry"
        }
      ]
    }
  },
  methods: {
    getIdentityCard() {
      this.axios
        .post("/Services/User.svc/GetUserRfidCards", {
          userId: this.$route.params.id || this.$store.state.user.id,
          userIds: [this.$route.params.id || this.$store.state.user.id]
        })
        .then((res) => {
          this.rfid = res.data.d.map((rfid) => {
            return {
              rfid: rfid.rfid,
              rfidReversed: rfid.rfidReversed,
              activation: this.$date(rfid.activationdatetime).format(
                "DD/MM/YYYY"
              ),
              expiry: this.$date(rfid.expirydate).format("DD/MM/YYYY")
            }
          })
        })
    },
    createCard() {
      this.axios
        .post("/Services/User.svc/CreateRfidCard", {
          userId: this.$route.params.id || this.$store.state.user.id,
          rfid: this.create.rfid,
          expiryDate: this.$date(this.create.expirationDate).format(),
          activationDate: this.$date(this.create.activationDate).format()
        })
        .then((res) => {
          if (res.data.d.success) {
            this.$toast.success("RFID CompassIdentity Card created")
            this.getIdentityCard()
          } else {
            this.$toast.error(res.data?.d?.message)
          }
        })
        .catch(() => {
          this.$toast.error(
            "Something went wrong, you may not have permission to perform this action."
          )
          this.getIdentityCard()
        })
    }
  },
  mounted() {
    this.getIdentityCard()
  }
}
</script>

<style scoped></style>
