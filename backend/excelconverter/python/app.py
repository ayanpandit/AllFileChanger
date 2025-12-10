from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import pandas as pd
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'excel-converter'})

@app.route('/convert', methods=['POST'])
def convert_excel():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        target_format = request.form.get('format', 'csv')
        
        # Read Excel file
        df = pd.read_excel(io.BytesIO(file.read()))
        
        output = io.BytesIO()
        
        if target_format == 'csv':
            df.to_csv(output, index=False)
            mimetype = 'text/csv'
            filename = 'converted.csv'
        elif target_format == 'json':
            output.write(df.to_json(orient='records', indent=2).encode('utf-8'))
            mimetype = 'application/json'
            filename = 'converted.json'
        elif target_format == 'html':
            output.write(df.to_html(index=False).encode('utf-8'))
            mimetype = 'text/html'
            filename = 'converted.html'
        else:
            return jsonify({'error': 'Unsupported format'}), 400
        
        output.seek(0)
        return send_file(output, mimetype=mimetype, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert Excel file', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5020))
    app.run(host='0.0.0.0', port=port, debug=True)
