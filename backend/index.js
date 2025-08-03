const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow CORS for local dev and Render deployment
app.use(cors({
  origin: ['http://localhost:5173', 'https://allfilechanger.onrender.com'], // <-- Add your frontend URL here
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/', upload.array('images'), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const imageBytes = fs.readFileSync(file.path);
      let embeddedImage, width, height;
      const extension = path.extname(file.originalname).toLowerCase();

      if (extension === '.jpg' || extension === '.jpeg') {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
        width = embeddedImage.width;
        height = embeddedImage.height;
      } else if (extension === '.png') {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
        width = embeddedImage.width;
        height = embeddedImage.height;
      } else {
        throw new Error('Unsupported file type');
      }

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      fs.unlinkSync(file.path);
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error while converting images to PDF:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF.' });
  }
});

app.get('/', (req, res) => {
  res.send('Image to PDF backend is running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
