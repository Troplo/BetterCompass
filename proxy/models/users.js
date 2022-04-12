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
      },
      privacy: {
        type: DataTypes.JSON,
        defaultValue: {
          communications: {
            enabled: false,
            outsideTenant: false,
            directMessages: "friendsOnly",
            friendRequests: true
          }
        }
      },
      discussionsFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      discussionsLastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      discussionsImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      rowsPerPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15
      },
      hideIrrelevantTasks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      homeGrids: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [
          {
            items: [
              {
                id: 7,
                itemId: 11,
                name: "home.overdueLearningTasks",
                friendlyName: "Overdue Learning Tasks Warning Widget",
                invisible: true
              },
              {
                itemId: 0,
                id: 0,
                name: "home.calendar",
                friendlyName: "Calendar Widget"
              },
              {
                itemId: 1,
                id: 1,
                name: "home.tasks",
                friendlyName: "Tasks Widget"
              },
              {
                itemId: 2,
                id: 2,
                name: "home.events",
                friendlyName: "Events Widget"
              }
            ]
          },
          {
            items: [
              {
                id: 6,
                itemId: 10,
                name: "home.notifications",
                friendlyName: "Warnings/Notifications Widget",
                invisible: true
              },
              {
                itemId: 3,
                id: 3,
                name: "home.news",
                friendlyName: "News Widget"
              },
              {
                itemId: 4,
                id: 4,
                name: "home.weather",
                friendlyName: "Weather Widget",
                invisible: true
              },
              {
                itemId: 5,
                id: 5,
                name: "home.features",
                friendlyName: "Features Widget"
              }
            ]
          }
        ]
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  )
  return User
}
