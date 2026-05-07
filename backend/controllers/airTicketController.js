const { AirTicketModal, Employee } = require("../models");

exports.getAllAirTickets = async (req, res) => {

  try {
    const airTickets = await AirTicketModal.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'name'],
        }
      ]
    });
    res.status(200).json({ data: airTickets, message: "Air tickets fetched successfully" });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to fetch air tickets" });
  }
}

const decimalFields = ['purchase', 'refundOfPurchase', 'refundOfSales', 'sales', 'markup', 'totalAmount'];

function sanitizeDecimalFields(body) {
  const sanitized = { ...body };
  decimalFields.forEach(field => {
    if (sanitized[field] === '' || sanitized[field] === undefined) {
      sanitized[field] = null;
    }
  });
  return sanitized;
}

function extractDateOfTravel(body) {
  const data = sanitizeDecimalFields(body);
  // dateOfTravel lives inside tourDetails[0], extract it to the top-level column
  if (!data.dateOfTravel && data.tourDetails) {
    const details = typeof data.tourDetails === 'string' ? JSON.parse(data.tourDetails) : data.tourDetails;
    if (Array.isArray(details) && details.length > 0 && details[0].dateOfTravel) {
      data.dateOfTravel = details[0].dateOfTravel;
    }
  }
  return data;
}

exports.createAirTicket = async (req, res) => {
  try {
    const newAirTicket = await AirTicketModal.create(extractDateOfTravel(req.body));
    res.status(201).json({ data: newAirTicket, message: "Air ticket created successfully" });
  } catch (error) {
    res.status(500).json({ error: `Failed to create air ticket ${error.message}` });
  }
}

exports.getAirTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const airTicket = await AirTicketModal.findOne({ where: { id } });
    if (!airTicket) {
      return res.status(404).json({ message: "Air ticket not found" });
    }
    res.status(200).json({ data: airTicket, message: "Air ticket fetched successfully" });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to fetch air ticket" });
  }
}

exports.updateAirTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const airTicket = await AirTicketModal.findOne({ where: { id } });
    if (!airTicket) {
      return res.status(404).json({ message: "Air ticket not found" });
    }
    const updatedAirTicket = await airTicket.update(extractDateOfTravel(req.body));
    res.status(200).json({ data: updatedAirTicket, message: "Air ticket updated successfully" });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to update air ticket" });
  }
}

exports.deleteAirTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const airTicket = await AirTicketModal.findOne({ where: { id } });
    if (!airTicket) {
      return res.status(404).json({ message: "Air ticket not found" });
    }
    await airTicket.destroy();
    res.status(200).json({ message: "Air ticket deleted successfully" });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to delete air ticket" });
  }
}

exports.createRefundTicket = async (req, res) => {
  try {
    console.log("Refund Request Body:", req.body); // Debugging line
    const { edittingId, reason } = req.body;
    const ticket = await AirTicketModal.findByPk(edittingId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    delete ticket.dataValues.id;
    ticket.dataValues.type = 'Cancellation';
    ticket.dataValues.reason = reason;
    console.log("Refund Ticket Data:", ticket.dataValues); // Debugging line  
    await AirTicketModal.create(ticket.dataValues);
    res.status(201).json({ data: {}, message: "Refund ticket created successfully" });
  } catch (error) {
    res.status(500).json({ error: `Failed to create refund ticket: ${error.message}` });
  }
}
