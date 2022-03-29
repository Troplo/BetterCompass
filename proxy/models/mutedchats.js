"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class MutedChat extends Model {
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
  MutedChat.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      chatId: {
        type: DataTypes.BIGINT,
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
      modelName: "MutedChat"
    }
  )
  return MutedChat
}
