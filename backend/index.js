const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.post('/', upload.array('images'), async (req, res) => {
  console.log("POST / called");

  const files = req.files;
  console.log("Received files:", files?.map(f => f.originalname) || 'No files');

  if (!files || files.length === 0) {
    console.log("No files uploaded");
    return res.status(400).send('No images uploaded');
  }

  try {
    const doc = new PDFDocument({ autoFirstPage: false });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

    doc.pipe(res);

    for (const file of files) {
      const imagePath = path.join(__dirname, file.path);
      console.log(`Adding image to PDF: ${imagePath}`);

      // Add a new page and place the image
      doc.addPage();
      doc.image(imagePath, {
        fit: [500, 700],
        align: 'center',
        valign: 'center'
      });

      // Delete file after use
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`Error deleting temp file ${imagePath}:`, err);
      });
    }

    doc.end();
    console.log("PDF generation completed");

  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Error generating PDF');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
