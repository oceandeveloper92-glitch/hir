const { TourEnquiry, Lead, Employee, Quotation } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const dayjs = require("dayjs");
const { convert } = require("html-to-text");

exports.createEnquiry = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const {
      tourType,
      name,
      email,
      contactNumber,
      referenceBy,
      country,
      state,
      city,
      pickupDate,
      dropDate,
      noOfNights,
      pickupLocation,
      dropLocation,
      hotelDetails = [],
      noOfRooms,
      noOfAdults,
      noOfChildsBelow5,
      noOfChildsWithExtraBed,
      noOfChildsWithoutExtraBed,
      vehicleChoice,
      remarks,
      inclusions,
      exclusions,
      itinerary,
      visaExclusions,
      flightDetails,
      accommodationDetails,
      vendors = [],
      siteScenes = [],
      status,
      rejectReason,
      revisionNotes,
      approvalComments,
      citiesToCover = [],
      clientDetailsId,
      totalNights,
      hotelNights,
      numRooms,
      numAdults,
      numChildrenUnder5,
      numChildren6to10,
      numChildren10to13,
      destinationCountry,
      destinationState,
      vendorsId = [],
      siteScenesId = [],
      ...rest
    } = req.body;

    const userId = req.user.id;

    const today = moment().format('DDMMYYYY');
    const latestEnquiry = await TourEnquiry.findOne({
      where: {
        EnquiryNo: { [Op.like]: `${today}%` }
      },
      order: [['createdAt', 'DESC']]
    });
    let nextSeq = '001';
    if (latestEnquiry && latestEnquiry.EnquiryNo) {
      const lastSeq = latestEnquiry.EnquiryNo.slice(8);
      const nextNum = parseInt(lastSeq, 10) + 1;
      nextSeq = String(nextNum).padStart(3, '0');
    }
    const EnquiryNo = `${today}${nextSeq}`;
    const finalData = {
      ...rest,
      EnquiryNo,
      userId,
      tourType,
      name,
      email,
      contactNumber,
      referenceBy,
      country: country || destinationCountry,
      state: state || destinationState,
      city,
      pickupDate,
      dropDate,
      noOfNights: parseInt(noOfNights) || parseInt(totalNights) || 0,
      pickupLocation,
      dropLocation,
      // Hotel Details
      hotelDetails: Array.isArray(hotelDetails) ? hotelDetails : [],
      // Passenger Details
      noOfRooms: parseInt(noOfRooms) || parseInt(numRooms) || 0,
      noOfAdults: parseInt(noOfAdults) || parseInt(numAdults) || 0,
      noOfChildsBelow5: parseInt(noOfChildsBelow5) || parseInt(numChildrenUnder5) || 0,
      noOfChildsWithExtraBed: parseInt(noOfChildsWithExtraBed) || parseInt(numChildren6to10) || 0,
      noOfChildsWithoutExtraBed: parseInt(noOfChildsWithoutExtraBed) || parseInt(numChildren10to13) || 0,
      // Extra Details
      vehicleChoice,
      remarks,
      inclusions,
      exclusions,
      itinerary,
      visaExclusions,
      flightDetails,
      accommodationDetails,
      // Vendor and Site Scene
      vendors: Array.isArray(vendors) ? vendors : (Array.isArray(vendorsId) ? vendorsId : []),
      siteScenes: Array.isArray(siteScenes) ? siteScenes : (Array.isArray(siteScenesId) ? siteScenesId : []),
      // Status and Revisions
      status,
      rejectReason,
      revisionNotes,
      approvalComments,
      // Legacy fields for backward compatibility
      citiesToCover: Array.isArray(citiesToCover) ? citiesToCover : [],
    };

    // If clientDetailsId is provided, check for duplicates
    if (clientDetailsId) {
      const existing = await TourEnquiry.findOne({
        where: {
          EnquiryNo,
          clientDetailsId,
        },
      });

      if (existing) {
        return res.status(200).json({
          message: "Enquiry already exists",
          data: existing,
        });
      }
      finalData.clientDetailsId = clientDetailsId;
    }

    const newEnquiry = await TourEnquiry.create(finalData);

    if (clientDetailsId) {
      await Lead.update(
        { formStatus: "completed" },
        { where: { id: clientDetailsId } }
      );
    }
    console.log("New Enquiry Created:", newEnquiry);
    const quotation = await Quotation.findOne({
      where: { id: newEnquiry.id },
      order: [['createdAt', 'DESC']]
    });

    if (!quotation) {
      const newQuotation = await Quotation.create({

        EnquiryId: newEnquiry.id,
        name: newEnquiry.name,
        contactNumber: newEnquiry.contactNumber,
        userId: req.user.id,
        EnquiryNo: newEnquiry.EnquiryNo,
      });

      if (!newQuotation) {
        return res.status(400).json({ message: "Failed to create quotation for tour Enquiry" });
      }
    }



    res.status(201).json({
      message: "Enquiry created successfully",
      data: newEnquiry,
    });

  } catch (error) {
    console.error("Error creating Enquiry:", error);
    res.status(500).json({ message: "Failed to create Enquiry", error });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await TourEnquiry.findAll({

      include: [
        {
          model: Lead,
          as: "Lead",
          attributes: ["id", "name", "email", "phone", "status", "assignedTo"],
        },
        {
          model: Employee,

        }
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!enquiries || enquiries.length === 0) {
      return res.status(200).json({ message: "No enquiries found" });
    }
    res.status(200).json({ data: enquiries, message: "Enquiries retrieved successfully" });
  } catch (error) {

    res.status(500).json({ message: "Failed to retrieve enquiries", error });
  }
};

exports.getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const Enquiry = await TourEnquiry.findOne({
      where: { id },
      include: [
        {
          model: Lead,
          as: "Lead",
        },
      ],
    });

    if (!Enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ data: Enquiry, message: "Enquiry retrieved successfully" });
  } catch (error) {

    res.status(500).json({ message: "Failed to retrieve Enquiry", error });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tourType,
      name,
      email,
      contactNumber,
      referenceBy,
      country,
      state,
      city,
      pickupDate,
      dropDate,
      noOfNights,
      pickupLocation,
      dropLocation,
      hotelDetails = [],
      noOfRooms,
      noOfAdults,
      noOfChildsBelow5,
      noOfChildsWithExtraBed,
      noOfChildsWithoutExtraBed,
      vehicleChoice,
      remarks,
      inclusions,
      exclusions,
      itinerary,
      visaExclusions,
      flightDetails,
      accommodationDetails,
      vendors = [],
      siteScenes = [],
      status,
      rejectReason,
      revisionNotes,
      approvalComments,
      citiesToCover = [],
      totalNights,
      hotelNights,
      numRooms,
      numAdults,
      numChildrenUnder5,
      numChildren6to10,
      numChildren10to13,
      destinationCountry,
      destinationState,
      vendorsId = [],
      siteScenesId = [],
      ...rest
    } = req.body;

    console.log("Update Data:", req.body);

    // Find the Enquiry first
    const Enquiry = await TourEnquiry.findByPk(id);

    if (!Enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Prepare update data
    const updateData = {
      ...rest,
      tourType: tourType || Enquiry.tourType,
      name: name || Enquiry.name,
      email: email || Enquiry.email,
      contactNumber: contactNumber || Enquiry.contactNumber,
      referenceBy: referenceBy || Enquiry.referenceBy,
      country: country || destinationCountry || Enquiry.country,
      state: state || destinationState || Enquiry.state,
      city: city || Enquiry.city,
      pickupDate: pickupDate || Enquiry.pickupDate,
      dropDate: dropDate || Enquiry.dropDate,
      noOfNights: parseInt(noOfNights) || parseInt(totalNights) || Enquiry.noOfNights,
      pickupLocation: pickupLocation || Enquiry.pickupLocation,
      dropLocation: dropLocation || Enquiry.dropLocation,
      // Hotel Details
      hotelDetails: Array.isArray(hotelDetails) ? hotelDetails : Enquiry.hotelDetails,
      // Passenger Details
      noOfRooms: parseInt(noOfRooms) || parseInt(numRooms) || Enquiry.noOfRooms,
      noOfAdults: parseInt(noOfAdults) || parseInt(numAdults) || Enquiry.noOfAdults,
      noOfChildsBelow5: parseInt(noOfChildsBelow5) || parseInt(numChildrenUnder5) || Enquiry.noOfChildsBelow5,
      noOfChildsWithExtraBed: parseInt(noOfChildsWithExtraBed) || parseInt(numChildren6to10) || Enquiry.noOfChildsWithExtraBed,
      noOfChildsWithoutExtraBed: parseInt(noOfChildsWithoutExtraBed) || parseInt(numChildren10to13) || Enquiry.noOfChildsWithoutExtraBed,
      // Extra Details
      vehicleChoice: vehicleChoice || Enquiry.vehicleChoice,
      remarks: remarks !== undefined ? remarks : Enquiry.remarks,
      inclusions: inclusions !== undefined ? inclusions : Enquiry.inclusions,
      exclusions: exclusions !== undefined ? exclusions : Enquiry.exclusions,
      itinerary: itinerary !== undefined ? itinerary : Enquiry.itinerary,
      visaExclusions: visaExclusions !== undefined ? visaExclusions : Enquiry.visaExclusions,
      flightDetails: flightDetails !== undefined ? flightDetails : Enquiry.flightDetails,
      accommodationDetails: accommodationDetails !== undefined ? accommodationDetails : Enquiry.accommodationDetails,
      // Vendor and Site Scene
      vendors: Array.isArray(vendors) ? vendors : (Array.isArray(vendorsId) ? vendorsId : Enquiry.vendors),
      siteScenes: Array.isArray(siteScenes) ? siteScenes : (Array.isArray(siteScenesId) ? siteScenesId : Enquiry.siteScenes),
      // Status and Revisions
      status: status || Enquiry.status,
      rejectReason: rejectReason !== undefined ? rejectReason : Enquiry.rejectReason,
      revisionNotes: revisionNotes !== undefined ? revisionNotes : Enquiry.revisionNotes,
      approvalComments: approvalComments !== undefined ? approvalComments : Enquiry.approvalComments,
      // Legacy fields for backward compatibility
      citiesToCover: Array.isArray(citiesToCover) ? citiesToCover : Enquiry.citiesToCover,
    };

    // Update the Enquiry
    await Enquiry.update(updateData);

    // Fetch the updated Enquiry with associations
    const updatedEnquiry = await TourEnquiry.findOne({
      where: { id },
      include: [
        {
          model: Lead,
          as: "Lead",
          attributes: ["id", "name", "email", "phone", "status", "assignedTo"],
        },
        {
          model: Employee,
        }
      ],
    });

    console.log("Enquiry updated successfully:", updatedEnquiry.id);

    return res.status(200).json({
      message: "Enquiry updated successfully",
      data: updatedEnquiry
    });
  } catch (error) {
    console.error("Error updating Enquiry:", error);
    return res.status(500).json({ message: "Failed to update Enquiry", error: error.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const Enquiry = await TourEnquiry.findByPk(id);

    if (!Enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await Enquiry.destroy();
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {

    res.status(500).json({ message: "Failed to delete Enquiry", error });
  }
};

exports.getEnquiryByEnquiryId = async (req, res) => {
  try {
    const { EnquiryId } = req.params;
    const Enquiry = await TourEnquiry.findOne({
      where: { EnquiryNo: EnquiryId },
      include: [
        { model: Lead, attributes: ["id", "name", "email", "phone", "status"] },
      ],
    });

    if (!Enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ data: Enquiry, message: "Enquiry retrieved successfully" });
  } catch (error) {

    res.status(500).json({ message: "Failed to retrieve Enquiry", error });
  }
};

exports.getWhatsAppMessage = async (req, res) => {
  const { EnquiryNo } = req.params;


  const Enquiry = await TourEnquiry.findOne({
    where: { EnquiryNo: EnquiryNo }
  });

  if (!Enquiry) {
    res.status(404).json({ message: "Enquiry not found" });
  }



  const hotelList = [];

  if (Enquiry.hotelDetails && Array.isArray(Enquiry.hotelDetails)) {
    Enquiry.hotelDetails.forEach((hotel, index) => {
      hotelList.push(
        `${index + 1}. ${hotel.city}, ${hotel.hotelCategory}, ${hotel.nights} nights (${dayjs(hotel.checkIn).format('DD/MM/YYYY')} - ${dayjs(hotel.checkOut).format('DD/MM/YYYY')})`
      );
    });
  }

  try {
    const message = `
🌍 Hir International - Your Travel Enquiry 🌟

Hello! Thank you for choosing Hir International! Here's a summary of your travel Enquiry (${EnquiryNo}):

🧾 Traveller's Details
- Tour Type: ${Enquiry.tourType}
- Name: ${Enquiry.name}
- Email: ${Enquiry.email}
- Contact Number: ${Enquiry.contactNumber}
- Reference By: ${Enquiry.referenceBy}

📍 Travel Details
- Country: ${Enquiry.country}
${Enquiry.state ? `- State: ${Enquiry.state}` : ''}
- Pickup Date: ${dayjs(Enquiry.pickupDate).format('DD/MM/YYYY')}
- Drop Date: ${dayjs(Enquiry.dropDate).format('DD/MM/YYYY')}
- No. of Nights: ${Enquiry.noOfNights}
- Pickup Location: ${Enquiry.pickupLocation}
- Drop Location: ${Enquiry.dropLocation}

👥 Passenger Details
- Rooms: ${Enquiry.noOfRooms}
- Adults: ${Enquiry.noOfAdults}
- Children (Under 5): ${Enquiry.noOfChildsBelow5}
- Children (With Extra Bed): ${Enquiry.noOfChildsWithExtraBed}
- Children (Without Extra Bed): ${Enquiry.noOfChildsWithoutExtraBed}

🗺️ Hotel Details
${hotelList.length > 0 ? hotelList.join('\n') : 'No hotel details available'}

🧾 Other Details
- Vehicle Choice: ${Enquiry.vehicleChoice || 'Not specified'}
- Inclusions: ${convert(Enquiry.inclusions) || 'Not specified'}
- Remarks: ${convert(Enquiry.remarks) || 'No remarks'}

📞 Ready to plan your dream trip? Contact us at +91 99788 11180 or reply here!  
Hir International - Your journey begins here! 🌟

[Visit us: hirinternational.com]  
  `;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://web.whatsapp.com/send/?phone=${Enquiry.contactNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    res.status(200).json(link);
  } catch (error) {

    res.status(500).json({ message: "Failed to generate WhatsApp message", error });
  }
};