from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-splitter'})

@app.route('/split', methods=['POST'])
def split_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        mode = request.form.get('mode', 'all')  # 'all', 'range', 'pages'
        
        reader = PdfReader(io.BytesIO(pdf_file.read()))
        total_pages = len(reader.pages)
        
        if mode == 'all':
            # Return all pages as separate PDFs in a ZIP
            import zipfile
            zip_buffer = io.BytesIO()
            
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for i in range(total_pages):
                    writer = PdfWriter()
                    writer.add_page(reader.pages[i])
                    
                    page_buffer = io.BytesIO()
                    writer.write(page_buffer)
                    page_buffer.seek(0)
                    
                    zip_file.writestr(f'page_{i+1}.pdf', page_buffer.read())
            
            zip_buffer.seek(0)
            return send_file(
                zip_buffer,
                mimetype='application/zip',
                as_attachment=True,
                download_name='split_pages.zip'
            )
        
        elif mode == 'range':
            start_page = int(request.form.get('start', 1)) - 1
            end_page = int(request.form.get('end', total_pages))
            
            writer = PdfWriter()
            for i in range(start_page, end_page):
                writer.add_page(reader.pages[i])
            
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return send_file(
                output,
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'pages_{start_page+1}-{end_page}.pdf'
            )
        
        return jsonify({'error': 'Invalid mode'}), 400
        
    except Exception as e:
        return jsonify({'error': 'Failed to split PDF', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5011))
    app.run(host='0.0.0.0', port=port, debug=True)
