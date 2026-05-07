const express = require('express');
const router = express.Router();
const packageEnquiryMailController = require('../controllers/packageEnquirySendMail');

router.post('/send-to-vendor/:EnquiryNo', packageEnquiryMailController.sendPackageEnquiryMailToVendor);
router.post('/send-to-client/:EnquiryNo', packageEnquiryMailController.sendPackageEnquiryMailToCustomer);
router.post('/send-with-quotation/:quotationId', packageEnquiryMailController.sendPackageEnquiryMailWithQuotation);
router.get('/whatsapp-link/:EnquiryNo', packageEnquiryMailController.sendWhatsAppUrl);
router.get('/quotation-whatsapp-link/:quotationId', packageEnquiryMailController.sendQuotationWhatsAppMessage);
router.get('/preview-to-vendor/:EnquiryNo', packageEnquiryMailController.getPackageEnquiryMailPreviewToVendor);

module.exports = router;