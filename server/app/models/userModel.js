const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin", "peer"),
      defaultValue: "user",
    },
    // Verification and Required documents of employee
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true, // Ensures uniqueness only when not NULL
      validate: {
        isNumeric: true, // Ensures only numeric values
      },
    },
    alternate_phone: {
      type: DataTypes.STRING(15),
      allowNull: true, // Can be NULL
      validate: {
        isNumeric: true,
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference_contacts: {
      type: DataTypes.JSONB,
      allowNull: true, // Example: [{ name: "John", phone: "1234567890" }]
    },
    attachments: {
      type: DataTypes.JSONB, // Example: [{ filename: "resume.pdf", url: "..." }]
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

// User.associate = (models) => {
//   User.hasMany(models.Website, { foreignKey: "user_id", as: "websites" });
//   User.hasMany(models.Token, { foreignKey: "userId", as: "tokens" });
// };
module.exports = User;
