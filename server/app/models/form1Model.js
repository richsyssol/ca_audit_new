const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormOne = sequelize.define("FormOne", {
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
  reviewStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reviewEndDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mandatoryICAI: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mandatoryOther: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  voluntary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  specialCase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  newUnit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  boardDecision: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  centralStatutoryAudit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statutoryAudit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  internalAudit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxAudit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  concurrentAudit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  certificationWork: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otherAssurance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  conductedAudit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notConductedAudit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sameCity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  outsideCity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  eitherOption: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  preferredCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = FormOne;
