"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Sessions", "compassSession", {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.addColumn("Sessions", "expiredAt", {
      type: Sequelize.DATE
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
