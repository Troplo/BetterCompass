'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Sessions.init({
    session: DataTypes.STRING,
    compassUserId: DataTypes.BIGINT,
    sussiId: DataTypes.STRING,
    other: DataTypes.JSON,
    instance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sessions',
  });
  return Sessions;
};