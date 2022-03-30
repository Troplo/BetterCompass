"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      Chat.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })
    }
  }
  Chat.init({
      type: {
        type: DataTypes.ENUM(["direct", "group", "channel"])
      },
      privacy: {
        type: DataTypes.ENUM([
          "direct",
          "everyoneInvited",
          "tenantInvited",
          "manualInvited"
        ])
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: "Unnamed Group",
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      usersId: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
      },
      icon: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      privilegedUserIds: {
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
      modelName: "Chat"
    }
  )
  return Chat
}
