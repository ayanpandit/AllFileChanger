const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());

// Configure multer for image uploads
const upload = multer({ dest: 'uploads/' });

app.post('/', upload.array('images'), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send('No images uploaded');
  }

  try {
    const doc = new PDFDocument({ autoFirstPage: false });

    // Set headers to return PDF as a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

    // Pipe PDF stream to response
    doc.pipe(res);

    for (const file of files) {
      const imagePath = path.join(__dirname, file.path);

      // Add a new page and draw the image (scaled)
      doc.addPage();
      doc.image(imagePath, {
        fit: [500, 700], // Adjust to page size
        align: 'center',
        valign: 'center'
      });

      // Clean up uploaded temp file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    doc.end(); // Finalize PDF
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Error generating PDF');
  }
});

// IMPORTANT for Render: listen on 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
