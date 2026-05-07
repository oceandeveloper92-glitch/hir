const User = require("./userModel");
const Employee = require("./employeeModel");
const Department = require("./departmentModel");
const Vendor = require("./vendorModel");
const Lead = require("./leadModel");
const Passport = require("./passportModel");
const TourEnquiry = require("./tourEnquiryModel");
const Quotation = require("./quotationModel");
const SiteScene = require("./siteSceneModel");
const Visa = require("./visaModal");
const Notification = require("./notificationModel");
const AirTicketModal = require("./airTicketModal");
const CampaignModal = require("./compaignModal");
const IncentiveSettingsModal = require("./incentiveSettingsModal");
const IncentiveModal = require("./inventiveModal");
const VisaTravellersModal = require("./visaTravellersModal");
const LayoutSetting = require("./layoutSettingModel");

TourEnquiry.belongsTo(Lead, {
  foreignKey: "leadId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});


Quotation.belongsTo(Lead, {
  foreignKey: "leadId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

AirTicketModal.belongsTo(Lead, {
  foreignKey: "leadId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Passport.belongsTo(Lead, {
  foreignKey: "leadId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Visa.belongsTo(Lead, {
  foreignKey: "leadId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Lead.belongsTo(Employee, {
  foreignKey: "assignedTo",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Lead.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

TourEnquiry.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Quotation.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

AirTicketModal.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Passport.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Visa.belongsTo(Employee, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Department.hasMany(Employee, {
  foreignKey: "departmentId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Employee.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Quotation.belongsTo(TourEnquiry, { foreignKey: 'EnquiryNo', targetKey: 'EnquiryNo' });

TourEnquiry.hasMany(Quotation, { foreignKey: 'EnquiryNo', sourceKey: 'EnquiryNo' });

module.exports = {
  User,
  Employee,
  Department,
  Vendor,
  Lead,
  Passport,
  TourEnquiry,
  Quotation,
  SiteScene,
  Visa,
  Notification,
  AirTicketModal,
  CampaignModal,
  TourEnquiry,
  IncentiveSettingsModal,
  IncentiveModal,
  VisaTravellersModal,
  LayoutSetting,
};

