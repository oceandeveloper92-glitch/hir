const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Import the sequelize instance

// Define the User model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: "unique_username",
    validate: {
      len: [3, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "unique_email",
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 128],
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50],
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
    validate: {
      isIn: [["user", "admin"]],
    },
  },
},
{
  tableName: "users",
});

module.exports = User;
