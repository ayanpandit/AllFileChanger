# AllFileChanger – Unified Backend

## Architecture

All 25 micro-services have been consolidated into **2 backends**:

```
backend/
├── node-server/          # Node.js – image processing (port 5001)
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── middleware/upload.js
│   ├── utils/sessions.js
│   └── routes/
│       ├── compress.js        POST /api/image/compress
│       ├── convert.js         POST /api/image/convert, /convert-batch
│       ├── resize.js          POST /api/image/resize, /resize/rotate
│       ├── rotateFlip.js      POST /api/image/rotate-flip
│       ├── crop.js            POST /api/image/crop
│       ├── watermark.js       POST /api/image/watermark
│       ├── bgRemove.js        POST /api/image/remove-background
│       └── editor.js          POST /api/image/edit
│
└── python-server/         # Python – PDF & document tools (port 5050)
    ├── app.py
    ├── requirements.txt
    ├── Dockerfile
    └── routes/
        ├── img_to_pdf.py      POST /api/pdf/image-to-pdf
        ├── pdf_merge.py       POST /api/pdf/merge
        ├── pdf_split.py       POST /api/pdf/split
        ├── pdf_compress.py    POST /api/pdf/compress
        ├── pdf_to_word.py     POST /api/pdf/to-word
        ├── pdf_to_excel.py    POST /api/pdf/to-excel
        ├── pdf_to_ppt.py      POST /api/pdf/to-powerpoint
        ├── pdf_protect.py     POST /api/pdf/protect
        ├── pdf_unlock.py      POST /api/pdf/unlock
        ├── word_to_pdf.py     POST /api/doc/word-to-pdf
        ├── word_converter.py  POST /api/doc/word-convert
        ├── excel_converter.py POST /api/doc/excel-convert
        ├── ppt_converter.py   POST /api/doc/ppt-convert
        ├── text_extractor.py  POST /api/doc/extract
        ├── ocr_scanner.py     POST /api/doc/scan
        ├── doc_merger.py      POST /api/doc/merge
        └── format_converter.py POST /api/doc/format-convert
```

## Running Locally

### Node.js backend
```bash
cd backend/node-server
npm install
node server.js            # → http://localhost:5001
```

### Python backend
```bash
cd backend/python-server
pip install -r requirements.txt
python app.py             # → http://localhost:5050
```

### Both at once (Docker)
```bash
docker compose up --build
```

## Production Deployment

### Docker
```bash
docker compose up -d --build
```

### Render / Railway
Each backend deploys independently – see `render.yaml` in project root.

### Environment Variables

| Variable | Backend | Description |
|----------|---------|-------------|
| `PORT` | Both | Port to listen on (auto-set by most hosts) |
| `CORS_ORIGIN` | Both | Comma-separated allowed origins (default `*`) |
| `NODE_ENV` | Node | `production` / `development` |
| `FLASK_ENV` | Python | `production` / `development` |
| `LOG_LEVEL` | Python | `DEBUG` / `INFO` / `WARNING` / `ERROR` |

### Frontend `.env`
```
VITE_NODE_API_URL=https://your-node-backend.onrender.com
VITE_PYTHON_API_URL=https://your-python-backend.onrender.com
```

## External Dependencies (Python server)

Some routes require system-level tools:
- **LibreOffice** – word-to-pdf, word-convert, ppt-convert, format-convert
- **Java** – pdf-to-excel (tabula-py)
- **Poppler** – pdf-to-powerpoint (pdf2image)
- **Tesseract OCR** – ocr-scan

All of these are included in the Python Dockerfile.
