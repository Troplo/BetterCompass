'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  };
  Feedback.init({
    feedbackText: DataTypes.TEXT,
    starRating: DataTypes.BIGINT,
    route: DataTypes.STRING,
    userId: DataTypes.STRING,
    tenant: DataTypes.STRING,
    debug: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};