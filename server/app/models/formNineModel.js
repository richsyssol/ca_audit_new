const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormNine = sequelize.define("FormNine", {
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
    // Renamed from frnNo for consistency
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  memberShipNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isReceivedByIndividual: {
    // Renamed for clarity
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isReceivedByFirm: {
    // Renamed for clarity
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  declarationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  pdfPath: {
    // To store PDF location
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    // To track approval/rejection
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
});

module.exports = FormNine;
