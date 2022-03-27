import Vue from 'vue';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'

Object.defineProperties(Vue.prototype, {
    $date: {
        get() {
            dayjs.extend(advancedFormat)
            return dayjs
        }
    }
});