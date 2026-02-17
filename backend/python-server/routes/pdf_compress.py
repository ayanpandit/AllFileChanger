"""PDF Compress – multi-level compression with image downsampling & metadata stripping."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import io, re

bp = Blueprint('pdf_compress', __name__)


def _compress_image(image_data, quality, max_dim):
    """Compress an embedded image: resize + JPEG-recompress."""
    try:
        img = Image.open(io.BytesIO(image_data))
        # Convert RGBA / palette to RGB for JPEG output
        if img.mode in ('RGBA', 'P', 'LA'):
            img = img.convert('RGB')
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Down-scale large images
        w, h = img.size
        if max(w, h) > max_dim:
            ratio = max_dim / max(w, h)
            img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=quality, optimize=True)
        return buf.getvalue()
    except Exception:
        return None            # leave the image untouched on failure


# Compression presets  ────────────────────────────────────────────────────
PRESETS = {
    'low':    {'img_quality': 80, 'max_dim': 2000},   # ~10-30 % reduction
    'medium': {'img_quality': 55, 'max_dim': 1500},   # ~40-60 % reduction
    'high':   {'img_quality': 30, 'max_dim': 1000},   # ~70-90 % reduction
}


@bp.route('/compress', methods=['POST'])
def compress_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        level = request.form.get('level', 'medium').lower()
        preset = PRESETS.get(level, PRESETS['medium'])

        raw = request.files['pdf'].read()
        original_size = len(raw)
        reader = PdfReader(io.BytesIO(raw))
        writer = PdfWriter()

        # ── 1. Add pages & compress content streams ──────────────────
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)

        # ── 2. Compress embedded images across all pages ─────────────
        for page in writer.pages:
            if '/Resources' not in page or '/XObject' not in page['/Resources']:
                continue
            x_objects = page['/Resources']['/XObject'].get_object()
            for obj_name in x_objects:
                x_obj = x_objects[obj_name].get_object()
                # Only process image XObjects
                if x_obj.get('/Subtype') != '/Image':
                    continue
                try:
                    w = int(x_obj['/Width'])
                    h = int(x_obj['/Height'])

                    # Decode image data from the PDF stream
                    img_data = x_obj._data  # raw decoded stream bytes

                    compressed = _compress_image(
                        img_data, preset['img_quality'], preset['max_dim']
                    )
                    if compressed and len(compressed) < len(img_data):
                        # Replace the stream with compressed JPEG
                        x_obj._data = compressed
                        x_obj['/Filter'] = '/DCTDecode'
                        x_obj['/Length'] = len(compressed)
                        # Update dimensions if resized
                        pil = Image.open(io.BytesIO(compressed))
                        x_obj['/Width'] = pil.width
                        x_obj['/Height'] = pil.height
                        if '/DecodeParms' in x_obj:
                            del x_obj['/DecodeParms']
                        if '/ColorSpace' not in x_obj:
                            x_obj['/ColorSpace'] = '/DeviceRGB'
                except Exception:
                    continue  # skip problematic images

        # ── 3. Strip metadata to save a few more KB ──────────────────
        writer.add_metadata({
            '/Producer': 'AllFileChanger',
            '/Creator': 'AllFileChanger PDF Compressor',
        })

        # ── 4. Remove unused objects & write ─────────────────────────
        try:
            writer.remove_unreferenced_resources()
        except Exception:
            pass

        out = io.BytesIO()
        writer.write(out)
        compressed_size = out.tell()
        out.seek(0)

        # If the "compressed" version ended up larger, just return the
        # original with only stream-compression applied (fallback).
        if compressed_size >= original_size:
            fallback_writer = PdfWriter()
            fallback_reader = PdfReader(io.BytesIO(raw))
            for p in fallback_reader.pages:
                p.compress_content_streams()
                fallback_writer.add_page(p)
            fallback_writer.add_metadata({
                '/Producer': 'AllFileChanger',
                '/Creator': 'AllFileChanger PDF Compressor',
            })
            out2 = io.BytesIO()
            fallback_writer.write(out2)
            if out2.tell() < original_size:
                out2.seek(0)
                out = out2
            else:
                # Even stream-compression didn't help → return original
                out = io.BytesIO(raw)

        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='compressed.pdf')
    except Exception as e:
        return jsonify(error='Failed to compress PDF', details=str(e)), 500
