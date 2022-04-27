const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const { User, Theme, Feedback } = require("../models")
const { Op } = require("sequelize")
const dayjs = require("dayjs")

router.all("*", auth, async (req, res, next) => {
  try {
    if (!req.user.admin) {
      throw Errors.unauthorized
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
})

router.get("/", auth, async (req, res, next) => {
  try {
    res.json({
      users: await User.count(),
      themes: await Theme.count(),
      feedback: await Feedback.count()
    })
  } catch (err) {
    return next(err)
  }
})

router.get("/metrics", auth, async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7))
    const createdAt = {
      [Op.gte]: sevenDaysAgo
    }

    const registrationStats = await User.findAll({
      where: {
        createdAt: createdAt
      }
    })

    const registrationGraphInterim = registrationStats.reduce(function (
      result,
      user
    ) {
      let day = dayjs(user.createdAt).format("YYYY-MM-DD")
      if (!result[day]) {
        result[day] = 0
      }
      result[day]++
      return result
    },
    {})

    const graph = {
      labels: Object.keys(registrationGraphInterim),
      datasets: [
        {
          data: Object.values(registrationGraphInterim),
          label: "Users",
          borderColor: "#3e95cd",
          pointBackgroundColor: "#FFFFFF",
          backgroundColor: "transparent"
        }
      ]
    }

    res.json(graph)
  } catch (err) {
    return next(err)
  }
})

router.get("/users", auth, async (req, res, next) => {
  try {
    const users = await User.findAndCountAll({
      include: [
        {
          model: Theme,
          as: "themeObject"
        }
      ]
    })
    res.json(users)
  } catch (err) {
    return next(err)
  }
})

router.get("/feedback", auth, async (req, res, next) => {
  try {
    const feedback = await Feedback.findAndCountAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    })
    res.json(feedback)
  } catch (err) {
    return next(err)
  }
})

module.exports = router
