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

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

    doc.pipe(res);

    for (const file of files) {
      const imagePath = path.join(__dirname, file.path);
      const img = doc.openImage(imagePath);

      // Create a new page with image size or fallback to A4
      doc.addPage({ size: [img.width, img.height] });
      doc.image(imagePath, 0, 0);

      // Delete temp file
      fs.unlink(imagePath, () => {});
    }

    doc.end();
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
