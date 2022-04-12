"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "homeGrids", {
      type: Sequelize.JSON,
      defaultValue: [
        {
          items: [
            {
              id: 0,
              internalId: 0,
              name: "home.calendar",
              friendlyName: "Calendar Widget"
            },
            {
              id: 1,
              internalId: 1,
              name: "home.tasks",
              friendlyName: "Tasks Widget"
            },
            {
              id: 2,
              internalId: 2,
              name: "home.events",
              friendlyName: "Events Widget"
            }
          ]
        },
        {
          items: [
            {
              id: 3,
              internalId: 3,
              name: "home.news",
              friendlyName: "News Widget"
            },
            {
              id: 4,
              internalId: 4,
              name: "home.weather",
              friendlyName: "Weather Widget"
            },
            {
              id: 5,
              internalId: 5,
              name: "home.features",
              friendlyName: "Features Widget"
            }
          ]
        }
      ]
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
