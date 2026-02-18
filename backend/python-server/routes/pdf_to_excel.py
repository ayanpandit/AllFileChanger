"""PDF → Excel conversion using tabula-py + pandas (FIX: added missing pandas import)."""

from flask import Blueprint, request, send_file, jsonify
import pandas as pd
import tabula
import io, os, tempfile, logging, gc

bp = Blueprint('pdf_to_excel', __name__)
logger = logging.getLogger(__name__)

@bp.route('/to-excel', methods=['POST'])
def pdf_to_excel():
    pdf_path = xlsx_path = None
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        pdf_path = tempfile.mktemp(suffix='.pdf')
        request.files['pdf'].save(pdf_path)

        tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
        if not tables:
            return jsonify(error='No tables found in PDF'), 400

        xlsx_path = pdf_path.replace('.pdf', '.xlsx')
        with pd.ExcelWriter(xlsx_path, engine='openpyxl') as writer:
            for i, tbl in enumerate(tables):
                tbl.to_excel(writer, sheet_name=f'Table_{i+1}', index=False)

        # MEMORY MANAGEMENT: free DataFrames
        del tables

        with open(xlsx_path, 'rb') as f:
            out = io.BytesIO(f.read())
        out.seek(0)

        return send_file(out,
                         mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         as_attachment=True, download_name='converted.xlsx')
    except Exception as e:
        logger.exception('PDF→Excel failed')
        return jsonify(error='Failed to convert PDF to Excel', details=str(e)), 500
    finally:
        for p in (pdf_path, xlsx_path):
            if p and os.path.exists(p):
                os.unlink(p)
        gc.collect()
