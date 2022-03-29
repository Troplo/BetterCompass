"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class BlockedUser extends Model {
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
  BlockedUser.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      blockedUserId: {
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
      modelName: "BlockedUser"
    }
  )
  return BlockedUser
}
