import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#0190ea",
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                text: "#000000",
                dark: "#151515",
                nav: "#FFFFFF",
            },
            dark: {
                primary: colors.info,
                nav: "#151515",
                dark: "#181818",
                text: "#ffffff"
            },
        },
    }
});
