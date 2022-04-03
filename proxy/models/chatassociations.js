"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ChatAssociation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      ChatAssociation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      })
      ChatAssociation.belongsTo(models.Chat, {
        foreignKey: "chatId",
        as: "chat"
      })
    }
  }
  ChatAssociation.init(
    {
      chatId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      rank: {
        type: DataTypes.ENUM(["member", "admin"]),
        defaultValue: "member",
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
      modelName: "ChatAssociation"
    }
  )
  return ChatAssociation
}
