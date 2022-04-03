"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "discussionsFirstName", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("Users", "discussionsLastName", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("Users", "discussionsImage", {
      type: Sequelize.STRING,
      allowNull: true
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
