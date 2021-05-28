<template>
  <div id="login">
    <section class="hero is-primary is-fullheight">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5">
              <div class="box">
                <p class="title-alt has-text-centered">{{ $store.state.school.name }}</p>
                <b-field label="Username">
                  <b-input v-model="login.username" type="username" placeholder="ABC0101"></b-input>
                </b-field>
                <b-field label="Password">
                  <b-input v-model="login.password" type="password" placeholder="Password"></b-input>
                </b-field>
                <div class="buttons">
                  <b-button class="is-primary" @click="doLogin" :loading="login.loading">Login</b-button>
                  <b-button>Forgot Password?</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      login: {
        username: '',
        password: '',
        loading: false,
        stateDump: ''
      }
    }
  },
  methods: {
    doLogin() {
      this.login.loading = true
      this.axios.post('/login.aspx?sessionstate=disabled', {
        username: this.login.username,
        password: this.login.password,
        "g-recaptcha-response": '',
        "__VIEWSTATE": "Vze2vzuymPtDm9RCwuE15sqZUts/AT9l52Euur9qZW4VjL1LEnVkO02JJOeblEFpdh2i3zGLj19MXIARwyLlXZhtzpV9wEGtn/ydLd1vJoJSfKnSkIS3PKgVa96J2gmxJpDAxuKoZ8jd0nSGQASDzf/1YljfhkSPudUP6meb5X/cEsb2BtKW2ZpZbdKJy+sI+aJ1RC7nBOp8/PXXfVmI+eS4SAM0vB1PZ7ox3j5/hBxADcHLqVCf5qW5B8UOv2+ihb85OqfI4ivIt7NIA78aD7dum6fqiTjiJ0z9Icy57iyTfjmBYe8Qg41lrOTITlZap81SvG3Bzxkn7CySKLZ+2PxjZwANNsWWt3YynnTvFuBAk8qeZJEMZmBAs+dM6CqbF/kqHGLow2Whtp19Z5wMJHgqBcVHkeZ5MkIMb55GAYjmq2kwLeRZ+vVbsJgoWLX8/FOnVjXXvkIRsX899Qz4tKQSQrxJNuINoXRzBrNHxdfPN5YprxT9pVxJ+yMd1D0pRasz/qcJ+kZm3BdYcmRoOtaF1+SZvHCyv2NpgQPrsT1xGuTHMokQ+T0Y/qpRBnXa4CgkwwYT9+3cklgHi+Qaut3pbbOPCP6yNuS09WWyj1yBuVGhCTvY33ar0POlGDThoZbp9fHz+QkJiLvX+JPu8xAGD42/VrCXQH7y3KtiIACsvCVzVMh3+mlpre6Ps/FJA6LCMZ61yJI6qA+5gXBtnxmlZi/pIRZv0asmiM2KeET+pR81DjwGKN0Vurlfb68M1yEbygXUDwM66RmosEs5jA96aPF3/ReXrKK6fsDjBCjuw5hEvydjtCfc6HMmFi2k",
        "__EVENTTARGET": "button1",
        "browserFingerprint": "3888210037",
        "__VIEWSTATEGENERATOR": "C2EE9ABB"
      })
          .then((res) => {
            this.login.stateDump(res)
          })
          .catch((res) => {
            this.login.stateDump(res)
          })
    }
  }
}
</script>

<style scoped>

</style>