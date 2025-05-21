const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormEight = sequelize.define("FormEight", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firmName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicationNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reviewerAppointedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  lastIssuedCertificateDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  extensionFromDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  extensionToDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pandemic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  seriousIllness: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pdfPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
});

module.exports = FormEight;
