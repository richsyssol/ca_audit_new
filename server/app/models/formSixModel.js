// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");

// const FormSix = sequelize.define("FormSix", {
//   partnerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   firmName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   reviewPeriod: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   questions: {
//     type: DataTypes.JSON, // Stores an array of questions
//     allowNull: false,
//   },
//   informationDueDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   reviewerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   declarationDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
// });

// module.exports = FormSix;

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormSix = sequelize.define("FormSix", {
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firmName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewPeriod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  informationDueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  declarationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON, // Stores an array of question objects
    allowNull: false,
    defaultValue: [],
  },
});

module.exports = FormSix;
