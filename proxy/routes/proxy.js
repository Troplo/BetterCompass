const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")
const router = express.Router()

router.use(function (req, res, next) {
  res.cookie(
    "cpssid_" + req.header("compassSchoolId"),
    req.cookies["cpssid_" + req.header("compassSchoolId")],
    { expires: new Date(253402300000000), httpOnly: true, secure: true }
  )
  res.cookie("ASP.NET_SessionId", req.cookies["ASP.NET_SessionId"], {
    expires: new Date(253402300000000),
    httpOnly: true,
    secure: true
  })
  res.setHeader("Access-Control-Allow-Origin", process.env.HOSTNAME)
  res.header("Access-Control-Allow-Methods", "*")
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  )
  next()
})

const compassRouter = function (req) {
  const instance =
    req.header("compassInstance") || req.query.forceInstance || "devices"
  console.log("Instance: " + instance)
  // this is to avoid the ability to proxy non Compass sites through the proxy.
  if (instance.match(/^[a-zA-Z0-9-]+$/)) {
    return "https://" + instance + ".compass.education"
  } else {
    console.log("Test failed: " + "https://" + instance + ".compass.education")
    return "https://devices.compass.education"
  }
}

router.use(
  "/",
  createProxyMiddleware({
    target: "devices.compass.education",
    router: compassRouter,
    changeOrigin: true,
    cookieDomainRewrite: process.env.HOSTNAME
  })
)

module.exports = router
