from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfMerger
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-merger'})

@app.route('/merge', methods=['POST'])
def merge_pdfs():
    try:
        if 'pdfs' not in request.files:
            return jsonify({'error': 'No PDF files provided'}), 400
        
        pdf_files = request.files.getlist('pdfs')
        
        if len(pdf_files) < 2:
            return jsonify({'error': 'At least 2 PDF files required for merging'}), 400
        
        merger = PdfMerger()
        
        for pdf_file in pdf_files:
            merger.append(io.BytesIO(pdf_file.read()))
        
        output = io.BytesIO()
        merger.write(output)
        merger.close()
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='merged.pdf'
        )
    except Exception as e:
        return jsonify({'error': 'Failed to merge PDFs', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5010))
    app.run(host='0.0.0.0', port=port, debug=True)
