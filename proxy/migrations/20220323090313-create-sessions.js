"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      session: {
        type: Sequelize.STRING
      },
      compassUserId: {
        type: Sequelize.BIGINT
      },
      sussiId: {
        type: Sequelize.STRING
      },
      other: {
        type: Sequelize.JSON
      },
      instance: {
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
    await queryInterface.dropTable("Sessions")
  }
}
