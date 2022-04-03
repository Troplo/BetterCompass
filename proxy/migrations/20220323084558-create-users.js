"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sussiId: {
        type: Sequelize.STRING
      },
      compassUserId: {
        type: Sequelize.BIGINT
      },
      displayCode: {
        type: Sequelize.STRING
      },
      instance: {
        type: Sequelize.STRING
      },
      settings: {
        type: Sequelize.JSON
      },
      compassUserHash: {
        type: Sequelize.UUID
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
    await queryInterface.dropTable("Users")
  }
}
