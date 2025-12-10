from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfMerger
from docx import Document
from docxcompose.composer import Composer
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'document-merger'})

@app.route('/merge', methods=['POST'])
def merge_documents():
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        file_type = request.form.get('type', 'pdf')
        
        if len(files) < 2:
            return jsonify({'error': 'At least 2 files required for merging'}), 400
        
        if file_type == 'pdf':
            merger = PdfMerger()
            for file in files:
                merger.append(io.BytesIO(file.read()))
            
            output = io.BytesIO()
            merger.write(output)
            merger.close()
            output.seek(0)
            
            return send_file(output, mimetype='application/pdf', as_attachment=True, download_name='merged.pdf')
        
        elif file_type == 'docx':
            # Load first document
            master_doc = Document(io.BytesIO(files[0].read()))
            composer = Composer(master_doc)
            
            # Append other documents
            for file in files[1:]:
                doc = Document(io.BytesIO(file.read()))
                composer.append(doc)
            
            output = io.BytesIO()
            composer.save(output)
            output.seek(0)
            
            return send_file(output, mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           as_attachment=True, download_name='merged.docx')
        
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
        
    except Exception as e:
        return jsonify({'error': 'Failed to merge documents', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5024))
    app.run(host='0.0.0.0', port=port, debug=True)
