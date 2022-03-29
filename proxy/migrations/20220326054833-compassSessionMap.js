"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("sessions", "compassSession", {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.addColumn("sessions", "expiredAt", {
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
