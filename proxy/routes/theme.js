const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const { User, Theme } = require("../models")
const { Op } = require("sequelize")

router.get("/", auth, async (req, res, next) => {
  try {
    const themes = await Theme.findAll({
      where: {
        [Op.or]: [
          {
            userId: req.user.id
          },
          {
            public: true
          }
        ]
      },
      include: [
        {
          model: User,
          attributes: ["id", "sussiId"],
          as: "user"
        }
      ]
    })
    res.json(themes)
  } catch (e) {
    next(e)
  }
})

router.post("/", auth, async (req, res, next) => {
  try {
    if (
      !req.body.theme?.name ||
      !req.body.theme?.primaryType ||
      !req.body.theme?.dark ||
      !req.body.theme?.light
    ) {
      throw Errors.invalidParameter("theme", "Theme validation failed.")
    }

    const theme = await Theme.create({
      name: req.body.name,
      public: false,
      userId: req.user.id,
      theme: req.body.theme
    })

    res.json(theme)
  } catch (e) {
    next(e)
  }
})

router.put("/:id", auth, async (req, res, next) => {
  try {
    if (
      !req.body.theme?.name ||
      !req.body.theme?.primaryType ||
      !req.body.theme?.dark ||
      !req.body.theme?.light
    ) {
      throw Errors.invalidParameter("theme", "Theme validation failed.")
    }

    const theme = await Theme.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    if (!theme) {
      throw Errors.invalidParameter("theme", "Theme not found.")
    }

    await theme.update({
      name: req.body.name,
      theme: req.body.theme
    })
    res.json(theme)
  } catch (e) {
    next(e)
  }
})

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const theme = await Theme.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    if (!theme) {
      throw Errors.invalidParameter("theme", "Theme not found.")
    }

    await User.update(
      {
        themeId: 1
      },
      {
        where: {
          themeId: theme.id
        }
      }
    )
    await theme.destroy()
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})

module.exports = router
