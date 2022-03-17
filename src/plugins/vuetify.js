import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.blue.lighten3,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                text: "#000000"
            },
            dark: {
                primary: colors.blue,
                dark: "#181818",
                text: "#ffffff"
            },
        },
    }
});
