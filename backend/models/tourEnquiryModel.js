const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/db");

const TourEnquiry = sequelize.define(
  "TourEnquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    EnquiryNo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: "EnquiryNo_unique", // Ensure EnquiryNo is unique
    },
    isHotelOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tourType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    pickupDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dropDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    noOfNights: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dropLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hotelDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("hotelDetails");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      }
    },
    noOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    noOfAdults: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    noOfChildsBelow5: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    noOfChildsWithExtraBed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    noOfChildsWithoutExtraBed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vehicleChoice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("flightDetails");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      }
    },
    accommodationDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("accommodationDetails");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      }
    },
    siteScenes: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("siteScenes");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      }
    },
    vendors: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("vendors");
        if (typeof value === "string") {
          return value ? JSON.parse(value) : null;
        }
        return value;
      }
    },
    rejectReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    revisionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvalComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mealPlan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "tour_enquiries",
    hooks: {
      async beforeCreate(Enquiry, options) {
        const now = new Date();
        const pad = (n, l = 2) => n.toString().padStart(l, '0');
        const dateStr = pad(now.getDate()) + pad(now.getMonth() + 1) + now.getFullYear(); // e.g., 21072025

        // Get the latest EnquiryNo regardless of date
        const last = await TourEnquiry.findOne({
          where: {
            EnquiryNo: {
              [Op.ne]: null,
            }
          },
          order: [['createdAt', 'DESC']]
        });

        let seq = 1;
        if (last && last.EnquiryNo) {
          const lastSeq = parseInt(last.EnquiryNo.slice(-3), 10);
          if (!isNaN(lastSeq)) seq = lastSeq + 1;
        }

        Enquiry.EnquiryNo = dateStr + pad(seq, 3); // final format e.g., 21072025003
      }
    }
  }
);

module.exports = TourEnquiry;
