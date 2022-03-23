const { User } = require("../models")
const axios = require("axios");

module.exports = function (req, res, next) {
  try {
    const compassRouter = function(req) {
      const instance = req.header("compassInstance") || req.query.forceInstance || "devices"
      console.log("Instance: " + instance)
      // this is to avoid the ability to proxy non Compass sites through the proxy.
      if(instance.match(/^[a-zA-Z0-9-]+$/)) {
        return "https://" + instance + ".compass.education"
      } else {
        console.log("Test failed: " + "https://" + instance + ".compass.education")
        return "https://devices.compass.education"
      }
    }
    if(!req.cookies["cpssid_" + req.header("compassSchoolId")]) {
      res.status(401).json({
        errors: [{
          message: "Unauthorized"
        }]
      })
    } else {
      console.log( req.header("compassUserId"))
      console.log(req.cookies)
      axios.post(compassRouter(req) + "/services/mobile.svc/GetPersonalDetails", {
        userId: req.header("compassUserId")
      }, { headers: {
        Cookie: req.cookies
        } }  ).then(async (response) => {
        if (response.data.d) {
          req.compassUser = response.data.d
          const user = await User.findOne({
            where: {
              compassUserId: req.body.compassUserId
            }
          })
          if (user) {
            req.user = user
            next()
          } else {
            res.status(401).json({
              errors: [{
                message: "User is not opted into BetterCompass Accounts."
              }]
            })
          }
          next()
        } else {
          res.status(401).json({
            errors: [{
              message: "Unauthorized"
            }]
          })
        }
      }).catch((e) => {
        console.log(e.response.data)
        res.status(401).json({
          errors: [{
            message: "Unauthorized"
          }]
        })
      })
    }
  } catch (e) {
    console.log(e)
  }
}
