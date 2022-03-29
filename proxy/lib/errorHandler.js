let { Sequelize } = require("../models")
let Errors = require("./errors")

module.exports = function (err, req, res, next) {
  if (err instanceof Sequelize.ValidationError) {
    res.status(400).json(err)
  } else if (err.name in Errors) {
    res.status(err.status).json({
      errors: [err]
    })
  } else {
    console.error(err)
    res.status(500).json({
      errors: [Errors.unknown]
    })
  }
}
