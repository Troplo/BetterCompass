const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const { User, Theme, Feedback } = require("../models")

router.get("/", auth, async (req, res, next) => {
  try {
    if (!req.user.admin) {
      throw Errors.unauthorized
    } else {
      res.json({
        users: await User.count(),
        themes: await Theme.count(),
        feedback: await Feedback.count()
      })
    }
  } catch (err) {
    return next(err)
  }
})

module.exports = router
