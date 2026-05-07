const { workerData, parentPort } = require('worker_threads');
const { generatePdf } = require('../controllers/PdfGenerationController');

(async () => {
  try {
    // Only pass serializable data
    const pdfBuffer = await generatePdf(workerData.quotationId);

    // Send the buffer back to main thread
    parentPort.postMessage({ success: true, pdfBuffer });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
})();
