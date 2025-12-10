from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import io
import os
import tempfile
import tabula

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-to-excel'})

@app.route('/convert', methods=['POST'])
def pdf_to_excel():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_temp:
            pdf_file.save(pdf_temp.name)
            pdf_path = pdf_temp.name
        
        # Extract tables from PDF
        tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
        
        if not tables:
            os.unlink(pdf_path)
            return jsonify({'error': 'No tables found in PDF'}), 400
        
        # Create Excel file
        excel_path = pdf_path.replace('.pdf', '.xlsx')
        
        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            for i, table in enumerate(tables):
                table.to_excel(writer, sheet_name=f'Table_{i+1}', index=False)
        
        # Read the Excel file
        with open(excel_path, 'rb') as f:
            output = io.BytesIO(f.read())
        
        # Cleanup
        os.unlink(pdf_path)
        os.unlink(excel_path)
        
        output.seek(0)
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='converted.xlsx'
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert PDF to Excel', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5015))
    app.run(host='0.0.0.0', port=port, debug=True)
