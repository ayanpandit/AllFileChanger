"""Excel Converter – convert XLSX to CSV / JSON / HTML."""

from flask import Blueprint, request, send_file, jsonify
import pandas as pd
import io, gc

bp = Blueprint('excel_converter', __name__)

@bp.route('/excel-convert', methods=['POST'])
def convert_excel():
    try:
        if 'file' not in request.files:
            return jsonify(error='No file provided'), 400

        fmt = request.form.get('format', 'csv')
        raw = request.files['file'].read()
        df = pd.read_excel(io.BytesIO(raw))
        del raw  # MEMORY MANAGEMENT: free raw bytes
        out = io.BytesIO()

        if fmt == 'csv':
            df.to_csv(out, index=False)
            mime, name = 'text/csv', 'converted.csv'
        elif fmt == 'json':
            out.write(df.to_json(orient='records', indent=2).encode('utf-8'))
            mime, name = 'application/json', 'converted.json'
        elif fmt == 'html':
            out.write(df.to_html(index=False).encode('utf-8'))
            mime, name = 'text/html', 'converted.html'
        else:
            return jsonify(error='Unsupported format'), 400

        del df  # MEMORY MANAGEMENT: free DataFrame
        out.seek(0)
        return send_file(out, mimetype=mime, as_attachment=True, download_name=name)
    except Exception as e:
        return jsonify(error='Failed to convert Excel file', details=str(e)), 500
    finally:
        gc.collect()
