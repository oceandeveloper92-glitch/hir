const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const TourEnquiry = require("./tourEnquiryModel");

const Quotation = sequelize.define(
  "Quotation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    EnquiryNo: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: TourEnquiry,
        key: "EnquiryNo"
      }
    },
    quotationNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    internalRemark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "draft",
    },
    inclusions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    exclusions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    itinerary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visaExclusions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    flightDetails: {
      get() {
        const value = this.getDataValue("flightDetails");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      },
      type: DataTypes.JSON,
      allowNull: true,
    },
    mealPlan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accommodationDetails: {
      get() {
        const value = this.getDataValue("accommodationDetails");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      },
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "quotations",
    timestamps: true,
    hooks: {
      async beforeCreate(quotation, options) {
        if (quotation.EnquiryNo) {
          const existing = await Quotation.findAll({
            where: { EnquiryNo: quotation.EnquiryNo },
            order: [["createdAt", "ASC"]]
          });
          if (existing.length === 0) {
            quotation.quotationNo = `${quotation.EnquiryNo}_Q01`;
          } else {
            const nextSeq = existing.length + 1;
            quotation.quotationNo = `${quotation.EnquiryNo}_Q${String(nextSeq).padStart(2, '0')}`;
          }
        }
      }
    }
  }
);

module.exports = Quotation;
