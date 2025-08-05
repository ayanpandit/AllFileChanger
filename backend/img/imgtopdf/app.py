from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import img2pdf
import io

app = Flask(__name__)
CORS(app)

# Optional: limit upload size to 25MB
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # 25 MB

@app.route('/')
def home():
    return jsonify({"status": "Backend running"}), 200

@app.route('/upload', methods=['POST'])
def upload():
    try:
        files = request.files.getlist('images')
        if not files:
            return jsonify({"error": "No files uploaded"}), 400

        image_bytes = [file.read() for file in files]
        output_pdf = img2pdf.convert(image_bytes)

        return send_file(
            io.BytesIO(output_pdf),
            as_attachment=True,
            download_name="converted.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Only used for local development. Gunicorn will call `app` directly in production.
if __name__ == '__main__':
    app.run()
