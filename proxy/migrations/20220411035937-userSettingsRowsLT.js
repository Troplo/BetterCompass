"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "rowsPerPage", {
      type: Sequelize.INTEGER,
      defaultValue: 15
    })
    await queryInterface.addColumn("Users", "hideIrrelevantTasks", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
