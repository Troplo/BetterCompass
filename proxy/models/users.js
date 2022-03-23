'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    sussiId: DataTypes.STRING,
    compassUserId: DataTypes.BIGINT,
    displayCode: DataTypes.STRING,
    instance: DataTypes.STRING,
    compassUserHash: DataTypes.UUID,
    settings: {
      type: DataTypes.JSON,
      defaultValue: {dark: true, learningTaskNotification: true, weather: true, minimizeHeaderEvents: false}
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};