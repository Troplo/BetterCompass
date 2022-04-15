const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const axios = require("axios")
const { User, Session, Theme } = require("../models")
const cryptoRandomString = require("crypto-random-string")
const { Op } = require("sequelize")

router.post("/login", (req, res, next) => {
  try {
    axios.post("http://localhost:23994/services/admin.svc/AuthenticateUserCredentials", {
      schoolId: req.body.schoolId,
      username: req.body.username,
      password: req.body.password
    }, {
      headers: {
        compassInstance: req.header("compassInstance") ||
          req.query.compassInstance ||
          "devices"
      },
      withCredentials: true
    }).then((response) => {
      axios
        .post("http://localhost:23994/services/admin.svc/GetApiKey", {
          password: req.body.password,
          schoolId: req.body.schoolId,
          sussiId: req.body.username
        }, {
          headers: {
            compassInstance: req.header("compassInstance") ||
              req.query.compassInstance ||
              "devices"
          }
        }).then((response2) => {
        if (!response.data.d.success) {
          res.status(401)
          res.json({
            errors: [{
              name: "invalidUserOrPassword",
              message: "Invalid Invalid username or password.",
              status: 401
            }]
          })
        } else {
          console.log(response.headers["set-cookie"])
          console.log(1000 * 60 * 60 * 24 * 365)
          if(req.body.rememberMe) {
            res.cookie("ASP.NET_SessionId", response.headers["set-cookie"][0].split(";")[0].split("=")[1], {
              maxAge: 1000 * 60 * 60 * 24 * 365,
              httpOnly: true,
              secure: true,
              domain: process.env.HOSTNAME,
              sameSite: "strict"
            })
          } else {
            res.cookie("ASP.NET_SessionId", response.headers["set-cookie"][0].split(";")[0].split("=")[1], {
              httpOnly: true,
              secure: true,
              domain: process.env.HOSTNAME,
              sameSite: "strict"
            })
          }
          res.json({
            success: true,
            cookieToken: response.headers["set-cookie"][0].split(";")[0].split("=")[1],
            token: response2.data.d,
            userId: response.data.d?.roles[0].userId
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    })
  } catch (err) {
    next(err)
  }
})

router.get("/", auth, (req, res, next) => {
  try {
    axios.post("http://localhost:23994/graphql", {
      query: `query UserData{currentUser{id username firstName lastName idPhotoGuidVersioned reportName personalEmail dateOfBirth groupA groupB groupC groupD groupE middleName communicationsEmail baseRole children{id username firstName lastName idPhotoGuidVersioned reportName personalEmail dateOfBirth groupA groupB groupC groupD groupE middleName communicationsEmail baseRole}}}`
    }, {
      headers: {
        CompassAPIKey: req.header("CompassAPIKey") || "",
        compassInstance: req.header("compassInstance") ||
          req.query.compassInstance ||
          "devices"
      }
    }).then((response) => {
      // legacy fields
      response.data.data.currentUser.userId = JSON.parse(response.data.data.currentUser.id)
      response.data.data.currentUser.sussiId = response.data.data.currentUser.username
      response.data.data.currentUser.id = JSON.parse(response.data.data.currentUser.id)
      if (response.data.data.currentUser.children?.length) {
        response.data.data.currentUser.children.forEach((child) => {
          child.id = JSON.parse(child.id)
          child.userId = JSON.parse(child.id)
        })
      }

      res.json({
        bcUser: req.user,
        ...response.data.data.currentUser
      })
    }).catch((e) => {
      next(e)
    })
  } catch (e) {
    next(e)
  }
})

router.post("/logout", auth, (req, res, next) => {
  try {
    res.clearCookie("ASP.NET_SessionId")
    res.clearCookie("cpssid_" + req.header("compassSchoolId"))
    res.clearCookie("cpsdid")
    res.sendStatus(204)
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
          guidedWizard: req.body.guidedWizard,
          hideIrrelevantTasks: req.body.hideIrrelevantTasks,
          rowsPerPage: req.body.rowsPerPage,
          homeGrids: req.body.homeGrids,
          discussionsImage: req.body.discussionsImage,
          calendars: req.body.calendars,
          bookmarks: req.body.bookmarks
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
        "http://localhost:23994/services/mobile.svc/GetPersonalDetails",
        {
          userId: req.header("compassUserId")
        },
        {
          withCredentials: true,
          headers: {
            Cookie: req.headers.cookie,
            compassInstance:
              req.header("compassInstance") ||
              req.query.compassInstance ||
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
            req.query.compassInstance ||
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
        "http://localhost:23994/services/mobile.svc/GetPersonalDetails",
        {
          userId: req.header("compassUserId")
        },
        {
          withCredentials: true,
          headers: {
            Cookie: req.headers.cookie,
            compassInstance:
              req.header("compassInstance") ||
              req.query.compassInstance ||
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
            req.query.compassInstance ||
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
