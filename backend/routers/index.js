const router = require("express").Router();
const authRouter = require("./authRouter");
const employeeRouter = require("./employeeRoute");
const departmentRouter = require("./departmentRouter");
const vendorRouter = require("./vendorRouter");
const leadRouter = require("./leadRouter");
const passportRouter = require("./passportRouter");
const tourEnquiryRouter = require("./tourEnquiryRoutes");
const quotationRouter = require("./quotationRouter");
const siteSceneRouter = require("./siteSceneRoutes");
const visaRouter = require("./visaRouter");
const notificationsRouter = require("./notificationsRouter");
const pdfRouter = require("./pdfRouter");
const airTicketRouter = require("./airTicketRouter");
const packageEnquiryMailRouter = require("./packageEnquiryMailRouter");
const campaignRouter = require("./campaignRouter");
const passportSendMailRouter = require("./passportSendRouter");
const visaSendMailRouter = require("./visaSendMailRouter");
const dashboardRouter = require("./dashboardRouter");
const incentiveSettingRouter = require('./incentiveSettingsRouter');
const incentiveRouter = require('./incentiveRouter');
const visaTravellersRouter = require('./visaTravellersRouter');


router.use("/auth", authRouter);
router.use("/employee", employeeRouter);
router.use("/department", departmentRouter);
router.use("/vendor", vendorRouter);
router.use("/lead", leadRouter);
router.use("/passport", passportRouter);
router.use("/tour-Enquiry", tourEnquiryRouter);
router.use("/quotation", quotationRouter);
router.use("/site-scene", siteSceneRouter);
router.use("/visa", visaRouter);
router.use("/notification", notificationsRouter);
router.use("/pdf", pdfRouter);
router.use("/air-ticket", airTicketRouter);
router.use("/package-Enquiry-mail", packageEnquiryMailRouter);
router.use("/campaign", campaignRouter);
router.use("/passport-send-mail", passportSendMailRouter);
router.use("/visa-send-mail", visaSendMailRouter);
router.use("/dashboard", dashboardRouter);
router.use("/incentive-settings", incentiveSettingRouter);
router.use("/incentive", incentiveRouter);
router.use("/visa-travellers", visaTravellersRouter);



module.exports = router;
