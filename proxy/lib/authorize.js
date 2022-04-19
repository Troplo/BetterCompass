const { User, Theme } = require("../models")
const axios = require("axios")

module.exports = function (req, res, next) {
  try {
    axios
      .post(
        "http://localhost:23994/graphql",
        {
          query: `
      query UserData {
  currentUser {
    id
    username
  }
}`
        },
        {
          headers: {
            CompassApiKey: req.header("CompassApiKey") || "",
            compassInstance:
              req.header("compassInstance") ||
              req.query.compassInstance ||
              "devices",
            Cookie: req.header("Cookie") || "",
          },
          timeout: 900
        }
      )
      .then(async (response) => {
        if (response.data.data) {
          response.data.data.currentUser.id = JSON.parse(
            response.data.data.currentUser.id
          )
          req.compassUser = response.data.data.currentUser
          const user = await User.findOne({
            where: {
              compassUserId: req.compassUser.id,
              instance:
                req.header("compassInstance") ||
                req.query.compassInstance ||
                "devices"
            },
            include: [
              {
                model: Theme,
                as: "themeObject"
              }
            ]
          })
          if (user) {
            req.user = user
            next()
          } else {
            req.compassUser = response.data.data.currentUser
            console.log(
              "Creating account for user: " + req.compassUser.userId,
              req.compassUser.sussiId
            )
            req.user = await User.create({
              sussiId: response.data.data.currentUser.username,
              compassUserId: response.data.data.currentUser.id,
              displayCode: response.data.data.currentUser.username,
              instance:
                req.header("compassInstance") ||
                req.query.compassInstance ||
                "unknown",
              settings: {},
              compassUserHash: response.data.data.currentUser.userHash,
              theme: "dark",
              settingsSync: true
            })
            next()
          }
        } else {
          res.status(401).json({
            errors: [
              {
                message: "You need to be logged in."
              }
            ]
          })
        }
      })
      .catch(() => {
        res.status(500).json({
          errors: [
            {
              message: "Something went wrong."
            }
          ]
        })
      })
  } catch (e) {
    console.log(e)
  }
}
