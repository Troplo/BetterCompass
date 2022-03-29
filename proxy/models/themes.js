"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Theme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Theme.belongsTo(models.User, {
        as: "user"
      })
    }
  }
  Theme.init(
    {
      name: {
        type: DataTypes.STRING,
        defaultValue: "A BetterCompass Theme"
      },
      userId: {
        type: DataTypes.BIGINT
      },
      public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      theme: {
        type: DataTypes.JSON,
        defaultValue: {
          name: "A BetterCompass Theme",
          primaryType: "all",
          dark: {
            primary: "#0190ea",
            secondary: "#757575",
            accent: "#000000",
            error: "#ff1744",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#ff9800",
            card: "#151515",
            toolbar: "#191919",
            sheet: "#181818",
            text: "#000000",
            dark: "#151515",
            nav: "#FFFFFF",
            calendarNormalActivity: "#3f51b5",
            calendarActivityType7: "#f44336",
            calendarActivityType8: "#4caf50",
            calendarActivityType10: "#ff9800",
            calendarExternalActivity: "#2196f3"
          },
          light: {
            primary: "#0190ea",
            secondary: "#757575",
            accent: "#000000",
            error: "#ff1744",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#ff9800",
            card: "#151515",
            toolbar: "#191919",
            sheet: "#181818",
            text: "#000000",
            dark: "#151515",
            nav: "#FFFFFF",
            calendarNormalActivity: "#3f51b5",
            calendarActivityType7: "#f44336",
            calendarActivityType8: "#4caf50",
            calendarActivityType10: "#ff9800",
            calendarExternalActivity: "#2196f3"
          }
        }
      }
    },
    {
      sequelize,
      modelName: "Theme"
    }
  )
  return Theme
}
