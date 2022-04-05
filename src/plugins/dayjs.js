import Vue from "vue"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import customParseFormat from "dayjs/plugin/customParseFormat"

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      dayjs.extend(advancedFormat)
      dayjs.extend(relativeTime)
      dayjs.extend(customParseFormat)
      return dayjs
    }
  }
})
