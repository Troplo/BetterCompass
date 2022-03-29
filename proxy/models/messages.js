"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  Message.init(
    {
      chatId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM([
          "message",
          "leave",
          "join",
          "pin",
          "administrator",
          "rename",
          "system"
        ])
      },
      embeds: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
      },
      attachments: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "Message"
    }
  )
  return Message
}
