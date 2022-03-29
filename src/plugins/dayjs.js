import Vue from "vue"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import relativeTime from "dayjs/plugin/relativeTime"

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      dayjs.extend(advancedFormat)
      dayjs.extend(relativeTime)
      return dayjs
    }
  }
})
