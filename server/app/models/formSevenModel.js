// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");

// const Form7 = sequelize.define("Form7", {
//   applicationDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   firmName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   frn: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   applicationNo: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   reviewerAppointedDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   reasonsForDelay: {
//     type: DataTypes.ARRAY(DataTypes.STRING), // Array to store multiple reasons
//     allowNull: false,
//   },
//   additionalDaysRequested: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   peerReviewCompletionDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   reportSubmissionDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   partnerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   partnerMembershipNo: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   reviewerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   reviewerMembershipNo: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Form7;

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const FormSeven = sequelize.define("FormSeven", {
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
  reasonsForDelay: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  additionalDaysRequested: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peerReviewCompletionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reportSubmissionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  partnerMembershipNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewerMembershipNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = FormSeven;
