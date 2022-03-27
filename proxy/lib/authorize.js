const { User, Theme } = require("../models")
const axios = require("axios");

module.exports = function (req, res, next) {
  try {
    axios.post("http://localhost:23994/services/mobile.svc/GetExtendedUser", {
      userId: req.header("compassUserId")
    }, {
      withCredentials: true,
      headers: {
        "Cookie": req.headers.cookie,
        "compassInstance": req.header("compassInstance") || req.query.forceInstance || "devices",
        "compassSchoolId": req.header("compassSchoolId")
      }
    }).then(async (response) => {
      if (response.data.d.data) {
        req.compassUser = response.data.d.data
        const user = await User.findOne({
          where: {
            sussiId: req.compassUser.sussiId,
            instance: req.header("compassInstance") || req.query.forceInstance || "devices"
          },
          include: [{
            model: Theme,
            as: "themeObject"
          }]
        })
        if (user) {
          req.user = user
          next()
        } else {
          req.compassUser = response.data.d.data
          console.log("Creating account for user: " + req.compassUser.userId, req.compassUser.sussiId)
          req.user = await User.create({
            sussiId: response.data.d.data.sussiId,
            compassUserId: response.data.d.data.userId,
            displayCode: response.data.d.data.displayCode,
            instance: req.header("compassInstance") || req.query.forceInstance || "unknown",
            settings: {},
            compassUserHash: response.data.d.data.userHash,
            theme: "dark",
            settingsSync: true,
          })
          next()
        }
      } else {
        res.status(401).json({
          errors: [{
            message: "You need to be logged in."
          }]
        })
      }
    }).catch((e) => {
      console.log(e?.response?.data)
      res.status(500).json({
        errors: [{
          message: "Something went wrong."
        }]
      })
    })
  } catch (e) {
    console.log(e)
  }
}
