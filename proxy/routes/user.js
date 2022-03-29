const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const axios = require("axios")
const { User, Session, Theme } = require("../models")
const cryptoRandomString = require("crypto-random-string")
const { Op } = require("sequelize")

router.get("/", auth, (req, res, next) => {
  try {
    res.json(req.user)
  } catch (e) {
    next(e)
  }
})

router.put("/settings/:type", auth, async (req, res, next) => {
  try {
    if (req.params.type === "full") {
      await User.update(
        {
          theme: req.body.theme,
          weather: req.body.weather,
          settingsSync: req.body.settingsSync,
          minimizeHeaderEvents: req.body.minimizeHeaderEvents,
          learningTaskNotification: req.body.learningTaskNotification,
          calendarAutoJump: req.body.calendarAutoJump,
          guidedWizard: req.body.guidedWizard
        },
        {
          where: {
            id: req.user.id
          }
        }
      )
      res.sendStatus(204)
    } else if (req.params.type === "theme") {
      const theme = await Theme.findOne({
        where: {
          id: req.body.id,
          [Op.or]: [
            {
              userId: req.user.id
            },
            {
              public: true
            }
          ]
        }
      })
      if (theme) {
        await User.update(
          {
            themeId: theme.id,
            accentColor: req.body.accent
          },
          {
            where: {
              id: req.user.id
            }
          }
        )
        res.sendStatus(204)
      } else {
        throw Errors.invalidParameter("Theme", "Invalid theme specified")
      }
    } else {
      throw Errors.invalidParameter("Settings type", "Invalid settings type")
    }
  } catch (e) {
    next(e)
  }
})

router.post("/create", async (req, res, next) => {
  try {
    axios
      .post(
        "http://localhost:8080/services/mobile.svc/GetPersonalDetails",
        {
          userId: req.header("compassUserId")
        },
        {
          withCredentials: true,
          headers: {
            Cookie: req.headers.cookie,
            compassInstance:
              req.header("compassInstance") ||
              req.query.forceInstance ||
              "devices",
            compassSchoolId: req.header("compassSchoolId")
          }
        }
      )
      .then(async (response) => {
        const user = await User.create({
          sussiId: response.data.d.data.sussiId,
          compassUserId: response.data.d.data.userId,
          displayCode: response.data.d.data.displayCode,
          instance:
            req.header("compassInstance") ||
            req.query.forceInstance ||
            "unknown",
          settings: {},
          compassUserHash: response.data.d.data.userHash,
          weather: req.body.settings.weather,
          theme: req.body.settings.theme,
          learningTaskNotification: req.body.settings.learningTaskNotification,
          minimizeHeaderEvents: req.body.settings.minimizeHeaderEvents,
          settingsSync: true,
          cache: req.body.settings.cache
        })
        res.json({
          user
        })
      })
  } catch (err) {
    next(err)
  }
})

router.post("/create/alternate", async (req, res, next) => {
  try {
    axios
      .post(
        "http://localhost:8080/services/mobile.svc/GetPersonalDetails",
        {
          userId: req.header("compassUserId")
        },
        {
          withCredentials: true,
          headers: {
            Cookie: req.headers.cookie,
            compassInstance:
              req.header("compassInstance") ||
              req.query.forceInstance ||
              "devices",
            compassSchoolId: req.header("compassSchoolId")
          }
        }
      )
      .then(async (response) => {
        const user = await User.create({
          sussiId: response.data.d.data.sussiId,
          compassUserId: response.data.d.data.userId,
          displayCode: response.data.d.data.displayCode,
          instance:
            req.header("compassInstance") ||
            req.query.forceInstance ||
            "unknown",
          settings: {},
          compassUserHash: response.data.d.data.userHash,
          weather: req.body.settings.weather,
          theme: req.body.settings.theme,
          learningTaskNotification: req.body.settings.learningTaskNotification,
          minimizeHeaderEvents: req.body.settings.minimizeHeaderEvents,
          settingsSync: true,
          cache: req.body.settings.cache
        })
        const session = await Session.create({
          session:
            "BETTERCOMPASS-" +
            cryptoRandomString({
              length: 48
            }),
          compassUserId: user.compassUserId,
          sussiId: user.sussiId,
          instance: user.instance,
          other: {}
        })
        res.json({
          session: session.session,
          user
        })
      })
  } catch (err) {
    next(err)
  }
})

module.exports = router
