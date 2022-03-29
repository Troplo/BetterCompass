"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Theme, {
        as: "themeObject",
        foreignKey: "themeId"
      })
    }
  }
  User.init(
    {
      sussiId: DataTypes.STRING,
      compassUserId: DataTypes.BIGINT,
      displayCode: DataTypes.STRING,
      instance: DataTypes.STRING,
      compassUserHash: DataTypes.UUID,
      theme: {
        type: DataTypes.STRING,
        defaultValue: "dark"
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {
          dark: true,
          learningTaskNotification: true,
          weather: true,
          minimizeHeaderEvents: false
        }
      },
      weather: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      learningTaskNotification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      minimizeHeaderEvents: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      settingsSync: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      cache: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      themeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1
      },
      accentColor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      guidedWizard: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      calendarAutoJump: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  )
  return User
}
