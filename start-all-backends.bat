@echo off
echo ============================================================================
echo AllFileChanger - Starting All Individual Backends
echo ============================================================================
echo.
echo This will start 25 backend services across multiple ports
echo Press Ctrl+C in any window to stop that service
echo.
pause

REM ============================================================================
REM IMAGE TOOLS (Node.js - Ports 5001-5004, 5006-5009)
REM ============================================================================

echo.
echo [1/25] Starting Image Compressor (Port 5001)...
start "Image Compressor - Port 5001" cmd /k "cd /d %~dp0backend\imagecompressor\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [2/25] Starting Image Converter (Port 5002)...
start "Image Converter - Port 5002" cmd /k "cd /d %~dp0backend\imageconverter\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [3/25] Starting Image Resizer (Port 5003)...
start "Image Resizer - Port 5003" cmd /k "cd /d %~dp0backend\imageresizer\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [4/25] Starting Image Rotate/Flip (Port 5004)...
start "Image Rotate/Flip - Port 5004" cmd /k "cd /d %~dp0backend\imagerotateflip\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [5/25] Starting Image Crop (Port 5006)...
start "Image Crop - Port 5006" cmd /k "cd /d %~dp0backend\imagecrop\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [6/25] Starting Image Watermark (Port 5007)...
start "Image Watermark - Port 5007" cmd /k "cd /d %~dp0backend\imagewatermark\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [7/25] Starting Background Remove (Port 5008)...
start "Background Remove - Port 5008" cmd /k "cd /d %~dp0backend\imagebackgroundremove\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

echo [8/25] Starting Image Editor (Port 5009)...
start "Image Editor - Port 5009" cmd /k "cd /d %~dp0backend\imageeditor\node && npm install && node index.js"
timeout /t 2 /nobreak >nul

REM ============================================================================
REM PDF TOOLS (Python - Ports 5005, 5010-5018)
REM ============================================================================

echo.
echo [9/25] Starting Image to PDF (Port 5005)...
start "Image to PDF - Port 5005" cmd /k "cd /d %~dp0backend\imgtopdf\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [10/25] Starting PDF Merger (Port 5010)...
start "PDF Merger - Port 5010" cmd /k "cd /d %~dp0backend\pdfmerger\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [11/25] Starting PDF Splitter (Port 5011)...
start "PDF Splitter - Port 5011" cmd /k "cd /d %~dp0backend\pdfsplitter\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [12/25] Starting PDF Compressor (Port 5012)...
start "PDF Compressor - Port 5012" cmd /k "cd /d %~dp0backend\pdfcompressor\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [13/25] Starting PDF to Word (Port 5013)...
start "PDF to Word - Port 5013" cmd /k "cd /d %~dp0backend\pdftoword\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [14/25] Starting Word to PDF (Port 5014)...
start "Word to PDF - Port 5014" cmd /k "cd /d %~dp0backend\wordtopdf\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [15/25] Starting PDF to Excel (Port 5015)...
start "PDF to Excel - Port 5015" cmd /k "cd /d %~dp0backend\pdftoexcel\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [16/25] Starting PDF to PowerPoint (Port 5016)...
start "PDF to PowerPoint - Port 5016" cmd /k "cd /d %~dp0backend\pdftopowerpoint\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [17/25] Starting PDF Protect (Port 5017)...
start "PDF Protect - Port 5017" cmd /k "cd /d %~dp0backend\pdfprotect\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [18/25] Starting PDF Unlock (Port 5018)...
start "PDF Unlock - Port 5018" cmd /k "cd /d %~dp0backend\pdfunlock\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

REM ============================================================================
REM DOCUMENT TOOLS (Python - Ports 5019-5025)
REM ============================================================================

echo.
echo [19/25] Starting Word Converter (Port 5019)...
start "Word Converter - Port 5019" cmd /k "cd /d %~dp0backend\wordconverter\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [20/25] Starting Excel Converter (Port 5020)...
start "Excel Converter - Port 5020" cmd /k "cd /d %~dp0backend\excelconverter\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [21/25] Starting PowerPoint Converter (Port 5021)...
start "PowerPoint Converter - Port 5021" cmd /k "cd /d %~dp0backend\powerpointconverter\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [22/25] Starting Text Extractor (Port 5022)...
start "Text Extractor - Port 5022" cmd /k "cd /d %~dp0backend\textextractor\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [23/25] Starting OCR Scanner (Port 5023)...
start "OCR Scanner - Port 5023" cmd /k "cd /d %~dp0backend\ocrscanner\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [24/25] Starting Document Merger (Port 5024)...
start "Document Merger - Port 5024" cmd /k "cd /d %~dp0backend\documentmerger\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

echo [25/25] Starting Format Converter (Port 5025)...
start "Format Converter - Port 5025" cmd /k "cd /d %~dp0backend\formatconverter\python && pip install -r requirements.txt && python app.py"
timeout /t 2 /nobreak >nul

REM ============================================================================
REM FRONTEND (React + Vite)
REM ============================================================================

echo.
echo [FRONTEND] Starting React Frontend (Port 5173)...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo ============================================================================
echo All services are starting!
echo ============================================================================
echo.
echo Backend Services:
echo   - Image Tools:     Ports 5001-5004, 5006-5009 (Node.js)
echo   - PDF Tools:       Ports 5005, 5010-5018 (Python)
echo   - Document Tools:  Ports 5019-5025 (Python)
echo   - Frontend:        Port 5173 (React + Vite)
echo.
echo Wait 30-60 seconds for all services to fully start
echo Check each terminal window for any errors
echo.
echo To stop: Close individual terminal windows or press Ctrl+C in each
echo ============================================================================
pause
