const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormThree = sequelize.define("FormThree", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Name of the member as per ICAI records",
  },
  membershipNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "Membership number as per ICAI records",
  },
  trainingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: "Date of training attended for Peer Review",
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 10], // Ensures exactly 10 digits
    },
    comment: "Mobile number as per ICAI records",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    comment: "Email address as per ICAI records",
  },
  communicationAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "Present communication address as per ICAI records",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = FormThree;
