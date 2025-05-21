const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormFive = sequelize.define("FormFive", {
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firmName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewPeriod: {
    type: DataTypes.STRING, // Example: "2023-24"
    allowNull: false,
  },
  proposedVisitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  clients: {
    type: DataTypes.JSONB, // Stores client details as an array of objects [{ name, financialYear }]
    allowNull: false,
    defaultValue: [],
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  declarationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = FormFive;
