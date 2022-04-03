"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Feedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      feedbackText: {
        type: Sequelize.TEXT
      },
      starRating: {
        type: Sequelize.INTEGER
      },
      route: {
        type: Sequelize.STRING
      },
      debug: {
        type: Sequelize.JSON
      },
      userId: {
        type: Sequelize.STRING
      },
      tenant: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Feedbacks")
  }
}
