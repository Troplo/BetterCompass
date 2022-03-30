const express = require("express")
const router = express.Router()
const Errors = require("../lib/errors.js")
const auth = require("../lib/authorize.js")
const axios = require("axios")
const { User, Chat } = require("../models")
const cryptoRandomString = require("crypto-random-string")
const { Op } = require("sequelize")

router.get("/", auth, async (req, res, next) => {
  try {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            userId: req.user.id,
          },
          {
            usersId: {
              [Op.in]: [req.user.id]
            }
          }
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "sussiId", "instance"]
        }
      ]
    })
    res.json(chats)
  } catch (err) {
    next(err)
  }
})

module.exports = router