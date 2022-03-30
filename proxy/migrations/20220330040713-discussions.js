'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "discussionsFirstName", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("users", "discussionsLastName", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("users", "discussionsImage", {
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
};
