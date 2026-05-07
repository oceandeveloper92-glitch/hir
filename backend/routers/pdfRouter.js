const express = require('express');
const router = express.Router();
const { Worker } = require('worker_threads');
const path = require('path');

router.get('/:quotationId', (req, res) => {
  console.time("PdfTime");
  const quotationId = req.params.quotationId;
  const isView = req.query.view === 'true';
  const worker = new Worker(path.join(__dirname, '../workers/pdfWorker.js'), {
    workerData: { quotationId }
  });

  worker.on('message', (msg) => {
    if (!msg.success) {
      return res.status(500).json({ error: 'PDF generation failed', details: msg.error });
    }

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      isView ? 'inline' : 'attachment; filename="quotation.pdf"'
    );
    res.send(msg.pdfBuffer);
    console.timeEnd("PdfTime");
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
    res.status(500).json({ error: 'Worker failed', details: err.message });
  });

  worker.on('exit', (code) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });
});

module.exports = router;
