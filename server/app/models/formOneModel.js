const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormOne = sequelize.define(
  "FormOne",
  {
    firmName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    frn: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    peerReviewPeriodFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    peerReviewPeriodTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Peer Review Application Type
    mandatoryByICAI: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mandatoryByOtherRegulator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otherRegulatorName: {
      type: DataTypes.STRING(255),
      allowNull: true, // Required only if mandatoryByOtherRegulator is true
    },
    voluntary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    specialCaseReview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    newUnit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    asPerBoardDecision: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Signed Reports - Assurance Services Table
    signedReports: {
      type: DataTypes.JSON, // Stores array of objects [{ type: "Audit Type", majorClient: "Banks" }]
      allowNull: false,
      defaultValue: [],
    },
    // Statutory Audit for Listed Enterprises
    conductedStatutoryAuditListed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Reviewer Preference
    reviewerPreference: {
      type: DataTypes.ENUM("Same City", "Outside City", "Either"),
      allowNull: false,
    },
    preferredCity: {
      type: DataTypes.STRING(100),
      allowNull: true, // Required only if reviewerPreference is "Outside City"
    },
    // Contact Information
    communicationEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    peerReviewCertificateAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Submission Info
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    place: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = FormOne;
