const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormTwo = sequelize.define("FormTwo", {
  firmName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  periodOfReview: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = FormTwo;
