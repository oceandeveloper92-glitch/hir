const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Master Access
  isMaster: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  // Travel Services Access
  hasPackageAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasVisaAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasPassportAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasAirTicketAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Business Management Access
  isVendorMaster: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isSiteSceneMaster: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasEmployeeAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasDepartmentAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasCampaignAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "departments",
      key: "id",
    },
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
},
  {
    tableName: "employees",
  }
);

module.exports = Employee;
