/* ════════════════════════════════════════════════════════════════════════════
   pageContentData.js – Rich SEO content data for every tool page.
   Each key maps to a page and provides howItWorks, features, contentSections,
   faqs, and relatedTools arrays consumed by the PageContent component.
   ════════════════════════════════════════════════════════════════════════════ */

// ── Shared Related-Tool Pools ──────────────────────────────────────────────
const imageToolLinks = [
  { name: 'Image Compressor', desc: 'Reduce image file size', icon: '🗜️', path: '/image-compressor' },
  { name: 'Image Converter', desc: 'Convert image formats', icon: '🔄', path: '/image-converter' },
  { name: 'Image to PDF', desc: 'Convert images to PDF', icon: '📄', path: '/image-to-pdf' },
  { name: 'Resize Images', desc: 'Resize by dimensions', icon: '📏', path: '/image-resize' },
  { name: 'Crop Images', desc: 'Crop to perfect size', icon: '✂️', path: '/image-crop' },
  { name: 'Rotate & Flip', desc: 'Rotate or flip images', icon: '🌀', path: '/image-rotate-flip' },
  { name: 'Add Watermark', desc: 'Protect with watermarks', icon: '💧', path: '/image-watermark' },
  { name: 'Remove Background', desc: 'Remove image backgrounds', icon: '🖼️', path: '/remove-background' },
];

const pdfToolLinks = [
  { name: 'PDF Merger', desc: 'Combine multiple PDFs', icon: '📑', path: '/pdf-merge' },
  { name: 'PDF Splitter', desc: 'Split PDF into pages', icon: '✂️', path: '/pdf-split' },
  { name: 'PDF Compressor', desc: 'Reduce PDF file size', icon: '🗜️', path: '/pdf-compressor' },
  { name: 'PDF to Word', desc: 'Convert PDF to DOCX', icon: '📝', path: '/pdf-to-word' },
  { name: 'Word to PDF', desc: 'Convert DOCX to PDF', icon: '📄', path: '/word-to-pdf' },
  { name: 'PDF to Excel', desc: 'Extract tables to Excel', icon: '📊', path: '/pdf-to-excel' },
  { name: 'Protect PDF', desc: 'Password-protect PDFs', icon: '🔒', path: '/pdf-protect' },
  { name: 'Unlock PDF', desc: 'Remove PDF passwords', icon: '🔓', path: '/pdf-unlock' },
];

const docToolLinks = [
  { name: 'Word Converter', desc: 'Convert Word docs', icon: '📝', path: '/word-converter' },
  { name: 'Excel Converter', desc: 'Convert spreadsheets', icon: '📊', path: '/excel-converter' },
  { name: 'PPT Converter', desc: 'Convert presentations', icon: '📽️', path: '/ppt-converter' },
  { name: 'Text Extractor', desc: 'Extract text from files', icon: '📄', path: '/text-extractor' },
  { name: 'OCR Scanner', desc: 'Image text recognition', icon: '🔍', path: '/ocr-scanner' },
  { name: 'Document Merger', desc: 'Merge documents', icon: '📑', path: '/doc-merge' },
  { name: 'Format Converter', desc: 'Convert doc formats', icon: '🔄', path: '/format-converter' },
];

function pick(pool, exclude, count = 4) {
  return pool.filter(t => t.path !== exclude).slice(0, count);
}

// ═══════════════════════════════════════════════════════════════════════════
//  IMAGE TOOLS
// ═══════════════════════════════════════════════════════════════════════════

export const imageCompressorData = {
  howItWorks: [
    { step: '1', title: 'Upload Your Image', desc: 'Drag and drop or click to upload any JPG, PNG, or WebP image. Supports files up to 50 MB.' },
    { step: '2', title: 'Set Compression', desc: 'Choose a quality level or set a target file size. Our smart algorithm optimizes for the best visual quality.' },
    { step: '3', title: 'Download Compressed', desc: 'Get your optimized image instantly. Compare original vs compressed size with our visual reports.' },
  ],
  features: [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Advanced server-side compression delivers results in under 2 seconds, even for large high-resolution images.' },
    { icon: '🎯', title: 'Target File Size', desc: 'Specify an exact file size target and our intelligent algorithm will match it while preserving maximum quality.' },
    { icon: '👁️', title: 'Quality Preservation', desc: 'Our perceptual compression engine maintains visual fidelity even at aggressive compression ratios up to 90% reduction.' },
    { icon: '🔒', title: 'Private & Secure', desc: 'Your images are processed in memory and never stored on our servers. All uploads are encrypted in transit.' },
    { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive design works perfectly on desktop, tablet, and mobile. No app installation required.' },
    { icon: '🆓', title: '100% Free Forever', desc: 'No sign-up, no watermarks, no hidden fees. Compress unlimited images at no cost whatsoever.' },
  ],
  contentTitle: 'Everything You Need to Know About Image Compression',
  contentSections: [
    { heading: 'What Is Image Compression?', text: 'Image compression reduces the file size of digital images while attempting to maintain acceptable visual quality. There are two primary types: lossy compression (like JPEG) which permanently removes some data to achieve smaller sizes, and lossless compression (like PNG optimization) which reduces size without any data loss. Our tool uses intelligent lossy compression with perceptual algorithms that prioritize the visual information your eyes are most sensitive to, ensuring the best possible quality-to-size ratio.' },
    { heading: 'Why Compress Images for the Web?', text: 'Page load speed is a critical ranking factor for search engines like Google. Studies show that 53% of mobile visitors abandon pages that take longer than 3 seconds to load. Unoptimized images are the number one cause of slow websites, often accounting for over 60% of total page weight. By compressing your images, you can reduce page load times by 40-70%, improve your Core Web Vitals scores, reduce bandwidth costs, and provide a significantly better user experience for your visitors.' },
    { heading: 'JPEG vs PNG vs WebP: Which Format Should You Use?', text: 'JPEG is ideal for photographs and images with many colors — it uses lossy compression that works exceptionally well for photo content. PNG is best for images with transparency, text, logos, and graphics with sharp edges — it supports lossless compression and alpha channels. WebP is the modern standard that offers both lossy and lossless compression with 25-34% smaller file sizes than JPEG and PNG at equivalent quality. Our compressor automatically detects your image format and applies the optimal compression strategy for each type.' },
    { heading: 'Best Practices for Image Optimization', text: 'For the best results, start with the highest quality source image available. Resize images to the exact dimensions needed for your website before compressing. Use our target size feature when you need images under a specific file size limit (common for email attachments, social media uploads, and CMS restrictions). For web images, aim for under 200 KB for hero images and under 100 KB for thumbnails and content images. Always test compressed images visually to ensure they meet your quality standards.' },
  ],
  faqs: [
    { q: 'Is this image compressor really free?', a: 'Yes, completely free with no limits. There is no sign-up required, no watermarks added, and no daily upload caps. You can compress as many images as you need.' },
    { q: 'Will compressing my image reduce its quality?', a: 'Our smart compression algorithm minimizes visible quality loss. At the default 80% quality setting, most images show virtually no perceptible difference to the human eye while achieving 60-80% file size reduction.' },
    { q: 'What image formats are supported?', a: 'We support JPEG, PNG, and WebP formats. The compressor automatically detects your image format and applies the optimal compression technique for each type.' },
    { q: 'Is there a file size limit for uploads?', a: 'You can upload images up to 50 MB in size. This covers virtually all digital photographs and graphics.' },
    { q: 'Are my images stored on your servers?', a: 'No. Your images are processed entirely in memory and are never saved to disk. Once the compressed image is returned to your browser, all data is immediately discarded from our servers.' },
    { q: 'Can I compress multiple images at once?', a: 'Currently, the tool processes one image at a time for optimal compression results. We are developing batch compression which will be available soon.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-compressor'),
};

export const imageConverterData = {
  howItWorks: [
    { step: '1', title: 'Upload Your Image', desc: 'Drag and drop or select any image file. Supports JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and HEIC formats.' },
    { step: '2', title: 'Choose Output Format', desc: 'Select your desired output format from our wide range of supported types including modern formats like WebP and AVIF.' },
    { step: '3', title: 'Download Converted', desc: 'Your converted image downloads instantly. Batch convert multiple files to save time on large projects.' },
  ],
  features: [
    { icon: '🔄', title: '10+ Formats Supported', desc: 'Convert between JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC, and more. Every major image format covered.' },
    { icon: '📦', title: 'Batch Conversion', desc: 'Convert multiple images at once. Upload a batch, select the target format, and download them all in a ZIP archive.' },
    { icon: '✨', title: 'Quality Control', desc: 'Fine-tune output quality settings for lossy formats. Balance between file size and visual quality to meet your needs.' },
    { icon: '🔒', title: 'Secure Processing', desc: 'All conversions happen on encrypted servers. Your images are never stored and are deleted immediately after processing.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Server-side processing with Sharp delivers conversions in under a second for most files. No waiting around.' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Convert images right from your phone or tablet. Our responsive interface adapts perfectly to any screen size.' },
  ],
  contentTitle: 'The Complete Guide to Image Format Conversion',
  contentSections: [
    { heading: 'Why Convert Between Image Formats?', text: 'Different image formats serve different purposes. You might need to convert a PNG screenshot to JPEG for email (smaller file size), convert HEIC photos from your iPhone to JPG for universal compatibility, or convert images to WebP for faster website loading. Understanding when to use each format helps you optimize for quality, file size, compatibility, and transparency needs.' },
    { heading: 'Understanding Modern Image Formats', text: 'WebP, developed by Google, offers 25-34% smaller files than JPEG at equivalent quality and supports transparency. AVIF is even newer, providing up to 50% smaller files than JPEG with better quality. HEIC/HEIF is Apple\'s default format since iOS 11, offering excellent compression for photos. Our converter handles all these modern formats alongside traditional ones like JPEG, PNG, GIF, BMP, and TIFF.' },
    { heading: 'When to Use Each Format', text: 'Use JPEG for photographs and complex images where small file size matters. Use PNG for images that need transparency or have text and sharp edges. Use WebP for web publishing — it offers the best compression with quality. Use GIF for simple animations. Use TIFF for print-quality images that need lossless preservation. Use AVIF for cutting-edge web optimization with the smallest file sizes.' },
  ],
  faqs: [
    { q: 'Can I convert HEIC files from my iPhone?', a: 'Yes! We fully support HEIC/HEIF format conversion. Convert your iPhone photos to JPG, PNG, or any other format for universal compatibility.' },
    { q: 'Does converting formats reduce quality?', a: 'Converting to lossy formats like JPEG may reduce quality slightly. Converting between lossless formats (PNG to TIFF) preserves full quality. Our tool lets you control quality settings for the best results.' },
    { q: 'Can I convert multiple images at once?', a: 'Yes! Our batch conversion feature lets you upload multiple files, select a target format, and download all converted images as a ZIP archive.' },
    { q: 'What is WebP and should I use it?', a: 'WebP is a modern image format by Google that provides superior compression. It is supported by all major browsers and is recommended for web use as it significantly reduces page load times.' },
    { q: 'Is there a limit on file size?', a: 'You can upload images up to 100 MB each. This accommodates even high-resolution TIFF and RAW images.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-converter'),
};

export const imageResizeData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload any image from your device. Supports all popular formats including JPG, PNG, WebP, and more.' },
    { step: '2', title: 'Set Dimensions', desc: 'Enter exact pixel dimensions, choose a percentage scale, or select from popular preset sizes for social media.' },
    { step: '3', title: 'Download Resized', desc: 'Get your perfectly resized image instantly. The aspect ratio is maintained to prevent distortion.' },
  ],
  features: [
    { icon: '📐', title: 'Exact Dimensions', desc: 'Resize to exact pixel width and height. Perfect for meeting specific size requirements for websites, apps, or print.' },
    { icon: '🔗', title: 'Lock Aspect Ratio', desc: 'Maintain the original proportions automatically. Change one dimension and the other adjusts to prevent stretching or squishing.' },
    { icon: '📱', title: 'Social Media Presets', desc: 'One-click presets for Instagram, Facebook, Twitter, LinkedIn, and YouTube cover and profile image sizes.' },
    { icon: '📊', title: 'Percentage Scaling', desc: 'Scale images by percentage — upscale to 200% or downscale to 25%. Great for quick proportional resizing.' },
    { icon: '✨', title: 'Smart Resampling', desc: 'Advanced Lanczos and bilinear resampling algorithms ensure sharp, artifact-free results at any size.' },
    { icon: '🆓', title: 'Free & Unlimited', desc: 'Resize as many images as you want with no daily limits, no accounts, and no watermarks ever.' },
  ],
  contentTitle: 'Everything About Image Resizing',
  contentSections: [
    { heading: 'Why Resize Images?', text: 'Image resizing is essential for web optimization, social media posting, email attachments, printing, and app development. Oversized images slow down websites, exceed email attachment limits, and waste storage space. Properly sized images load faster, look sharper on target displays, and meet the exact dimension requirements of various platforms and use cases.' },
    { heading: 'Resizing Without Losing Quality', text: 'Our tool uses advanced resampling algorithms (Lanczos3 for downscaling, bilinear for upscaling) to deliver the sharpest results possible. When downscaling, quality is generally preserved or improved. When upscaling, there is an inherent limit — you cannot add detail that was not in the original. For best results when upscaling, limit increases to 200% and start with the highest resolution source available.' },
    { heading: 'Common Image Sizes for Social Media', text: 'Instagram posts: 1080×1080px (square), 1080×1350px (portrait). Facebook cover: 820×312px. Twitter header: 1500×500px. LinkedIn banner: 1584×396px. YouTube thumbnail: 1280×720px. Pinterest pin: 1000×1500px. Knowing these dimensions helps your content look professional across all platforms.' },
  ],
  faqs: [
    { q: 'Can I resize without changing the aspect ratio?', a: 'Yes! By default, the aspect ratio is locked. When you change the width, the height automatically adjusts proportionally, and vice versa.' },
    { q: 'What is the maximum image size I can upload?', a: 'You can upload images up to 50 MB. This covers most high-resolution photographs and digital artwork.' },
    { q: 'Can I make an image larger (upscale)?', a: 'Yes, you can upscale images. However, enlarging an image beyond its original resolution may reduce sharpness. We recommend keeping upscaling within 200% for best results.' },
    { q: 'Does resizing affect image quality?', a: 'Downscaling typically maintains or even improves perceived quality. Upscaling may show some softening. Our advanced algorithms minimize quality loss in all cases.' },
    { q: 'Can I resize to exact dimensions for social media?', a: 'Absolutely! We offer one-click presets for all major social media platforms including Instagram, Facebook, Twitter, LinkedIn, YouTube, and Pinterest.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-resize'),
};

export const imageCropData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload any image file from your device. All common formats are supported.' },
    { step: '2', title: 'Select Crop Area', desc: 'Use the interactive crop tool to select exactly the area you want to keep. Choose free-form or fixed aspect ratios.' },
    { step: '3', title: 'Download Cropped', desc: 'Download your perfectly cropped image instantly in the same format as the original.' },
  ],
  features: [
    { icon: '✂️', title: 'Precise Cropping', desc: 'Pixel-perfect crop tool with draggable handles. See exactly what your final image will look like before downloading.' },
    { icon: '📐', title: 'Aspect Ratio Lock', desc: 'Crop to standard aspect ratios like 16:9, 4:3, 1:1 (square), or enter custom ratios for specific requirements.' },
    { icon: '📱', title: 'Social Media Sizes', desc: 'One-click crop presets for Instagram stories, Facebook covers, YouTube thumbnails, and all popular platforms.' },
    { icon: '🖱️', title: 'Drag & Drop', desc: 'Intuitive drag-and-drop interface. Move and resize the crop area with smooth, responsive controls.' },
    { icon: '🔒', title: 'Privacy First', desc: 'Images are cropped on our secure servers and never stored. Your photos remain completely private.' },
    { icon: '⚡', title: 'Instant Processing', desc: 'Crop results are delivered in under a second. No waiting, no loading screens, just instant results.' },
  ],
  contentTitle: 'Master the Art of Image Cropping',
  contentSections: [
    { heading: 'Why Crop Your Images?', text: 'Cropping is one of the most fundamental image editing operations. It removes unwanted areas from the edges of a photo, helping you focus on the subject, improve composition, meet specific dimension requirements, and remove distracting elements from the background. Professional photographers crop nearly every image they deliver to clients.' },
    { heading: 'Composition Rules for Better Crops', text: 'The Rule of Thirds divides your image into a 3×3 grid — placing your subject at the intersection points creates a more dynamic and visually pleasing composition. Leading lines guide the viewer\'s eye through the image. Leaving negative space around your subject gives it room to breathe and creates a more professional look. Our crop tool supports these composition guides to help you create stunning images.' },
  ],
  faqs: [
    { q: 'Can I crop to a specific aspect ratio?', a: 'Yes! Choose from preset aspect ratios (1:1, 16:9, 4:3, etc.) or enter custom ratios. The crop area will lock to your chosen proportions.' },
    { q: 'Does cropping reduce image quality?', a: 'Cropping removes pixels from the edges but does not reduce the quality of the remaining image area. The cropped portion retains its original resolution and quality.' },
    { q: 'What formats can I crop?', a: 'We support JPG, PNG, WebP, GIF, BMP, and TIFF formats. The output will be in the same format as your original image.' },
    { q: 'Can I undo my crop?', a: 'You can adjust the crop area as many times as you want before downloading. Once downloaded, the crop is final, but you can always re-upload the original and crop differently.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-crop'),
};

export const imageRotateFlipData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload any image you want to rotate or flip. All major image formats are supported.' },
    { step: '2', title: 'Rotate or Flip', desc: 'Rotate by 90°, 180°, 270°, or any custom angle. Flip horizontally or vertically with one click.' },
    { step: '3', title: 'Download Result', desc: 'Download your rotated or flipped image instantly in high quality.' },
  ],
  features: [
    { icon: '🔄', title: 'Free Rotation', desc: 'Rotate images to any angle from 0° to 360°. Perfect for straightening tilted photos or creating artistic effects.' },
    { icon: '↔️', title: 'Horizontal Flip', desc: 'Mirror your image horizontally. Great for correcting selfie mirror effects or creating symmetrical designs.' },
    { icon: '↕️', title: 'Vertical Flip', desc: 'Flip images upside down. Useful for creating reflection effects and artistic compositions.' },
    { icon: '📐', title: 'Preset Angles', desc: 'Quick-access buttons for common rotations: 90° clockwise, 90° counter-clockwise, and 180° rotation.' },
    { icon: '👁️', title: 'Live Preview', desc: 'See your rotation and flip changes in real-time before downloading. No guesswork required.' },
    { icon: '🆓', title: 'Free & No Limits', desc: 'Rotate and flip unlimited images with no watermarks, no sign-up, and no daily limits.' },
  ],
  contentTitle: 'Image Rotation & Flipping Guide',
  contentSections: [
    { heading: 'When to Rotate Your Images', text: 'Image rotation is commonly needed when photos are taken at the wrong orientation, when scanning documents that were placed at an angle, when fixing horizon lines in landscape photography, or when preparing images for specific display orientations. Our tool supports both standard 90-degree increments and custom angle rotation for precision alignment.' },
    { heading: 'Understanding Image Flipping', text: 'Horizontal flipping (mirroring) creates a mirror image — left becomes right and vice versa. This is commonly used to correct selfie mirror effects, create symmetrical designs, or match the direction a subject is facing. Vertical flipping turns the image upside down, which is used for creating reflection effects and certain artistic compositions.' },
  ],
  faqs: [
    { q: 'Does rotating an image reduce quality?', a: 'Rotating by 90°, 180°, or 270° is lossless — no quality is lost. Rotating by arbitrary angles requires resampling, which may cause minimal quality reduction.' },
    { q: 'Can I rotate by a custom angle?', a: 'Yes! You can rotate by any angle between 0° and 360°. Use the angle slider or enter an exact value for precision.' },
    { q: 'What is the difference between rotate and flip?', a: 'Rotation turns the image around its center point. Flipping mirrors the image along an axis — horizontal flip mirrors left-to-right, vertical flip mirrors top-to-bottom.' },
    { q: 'Can I combine rotation and flipping?', a: 'Yes! You can apply both rotation and flipping to the same image. The changes are combined before the final output.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-rotate-flip'),
};

export const imageWatermarkData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload the image you want to watermark. Supports JPG, PNG, WebP and more.' },
    { step: '2', title: 'Add Watermark', desc: 'Add text or image watermark. Customize position, size, opacity, and rotation to your liking.' },
    { step: '3', title: 'Download Protected', desc: 'Download your watermarked image. Your content is now protected from unauthorized use.' },
  ],
  features: [
    { icon: '✍️', title: 'Text Watermarks', desc: 'Add custom text with full control over font size, color, opacity, and position. Perfect for copyright notices and branding.' },
    { icon: '🖼️', title: 'Image Watermarks', desc: 'Overlay a logo or graphic as a watermark. Adjust size, opacity, and placement for professional results.' },
    { icon: '🎨', title: 'Full Customization', desc: 'Control every aspect: position, rotation, opacity, font, color, and size. Create the perfect watermark for your brand.' },
    { icon: '📍', title: 'Smart Positioning', desc: 'Place watermarks in any corner, center, or tile across the entire image. Nine preset positions plus custom coordinates.' },
    { icon: '🔒', title: 'Protect Your Work', desc: 'Discourage unauthorized use of your photos, artwork, and designs with visible watermark branding.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Watermarks are applied server-side in milliseconds. Even large images are processed instantly.' },
  ],
  contentTitle: 'Protect Your Images with Watermarks',
  contentSections: [
    { heading: 'Why Watermark Your Images?', text: 'Watermarking is the most effective way to protect your visual content from unauthorized use. Photographers, designers, and content creators use watermarks to establish ownership, deter image theft, promote their brand, and maintain control over where their work appears. A well-placed watermark protects your intellectual property while still allowing your audience to appreciate the image.' },
    { heading: 'Watermarking Best Practices', text: 'Place watermarks where they cannot be easily cropped out — avoid placing them in corners only. Use semi-transparent watermarks (30-50% opacity) that are visible but do not overwhelm the image. For portfolios, place the watermark across the center or in a diagonal pattern. For previews, tile the watermark across the entire image. Always keep the original unwatermarked version in your private archive.' },
  ],
  faqs: [
    { q: 'Can I add both text and image watermarks?', a: 'Yes! You can add text watermarks with custom fonts and colors, or overlay an image/logo as a watermark. Customize opacity and position for either type.' },
    { q: 'Will the watermark degrade my image quality?', a: 'No. The watermark is composited onto your image at full quality. The original image quality is completely preserved beneath the watermark layer.' },
    { q: 'Can I tile the watermark across the entire image?', a: 'Yes! Choose the tile option to repeat the watermark in a grid pattern across the entire image, making it nearly impossible to remove.' },
    { q: 'Can I remove a watermark later?', a: 'Once a watermark is applied and the image is downloaded, it becomes part of the image and cannot be removed. Always keep your original unwatermarked files backed up.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-watermark'),
};

export const imageBgRemoveData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload a photo with a background you want to remove. Works best with clear subjects.' },
    { step: '2', title: 'AI Removes Background', desc: 'Our AI instantly detects the subject and removes the background. Review the transparent result.' },
    { step: '3', title: 'Download PNG', desc: 'Download your image with a transparent background as a PNG file, ready for use anywhere.' },
  ],
  features: [
    { icon: '🤖', title: 'AI-Powered Detection', desc: 'Advanced machine learning algorithms detect subjects with pixel-perfect precision, handling complex edges like hair and fur.' },
    { icon: '🖼️', title: 'Transparent Output', desc: 'Get a clean PNG with transparent background. Perfect for product photos, profile pictures, and graphic design projects.' },
    { icon: '⚡', title: 'Instant Processing', desc: 'Background removal completes in just 2-5 seconds. No manual tracing or editing required.' },
    { icon: '🛒', title: 'E-commerce Ready', desc: 'Create professional product photos with white or transparent backgrounds for Amazon, eBay, Shopify, and other marketplaces.' },
    { icon: '👤', title: 'Portrait Perfect', desc: 'Remove backgrounds from headshots and portraits for LinkedIn, resumes, ID photos, and social media profiles.' },
    { icon: '🆓', title: 'Free & Private', desc: 'Remove backgrounds from unlimited images. No account required and your photos are never stored.' },
  ],
  contentTitle: 'AI Background Removal Made Simple',
  contentSections: [
    { heading: 'How AI Background Removal Works', text: 'Our tool uses deep learning models trained on millions of images to understand the difference between foreground subjects and backgrounds. The AI analyzes the image, creates a precise segmentation mask around the subject, and removes everything outside that mask. This technology handles complex edges like hair, fur, transparent objects, and intricate patterns that would take hours to manually edit in Photoshop.' },
    { heading: 'Popular Uses for Background Removal', text: 'E-commerce product photography (white background requirements), professional headshots for LinkedIn and resumes, creating marketing materials and social media graphics, designing logos and brand assets, real estate photography editing, passport and ID photo preparation, and creating stickers and custom merchandise designs.' },
  ],
  faqs: [
    { q: 'How accurate is the AI background removal?', a: 'Our AI achieves 95%+ accuracy for most images. It handles complex edges like hair and fur exceptionally well. Results may vary for very complex or low-contrast images.' },
    { q: 'What output format do I get?', a: 'The output is always a PNG file with a transparent background. PNG is the standard format for images with transparency support.' },
    { q: 'Can I add a new background after removing the old one?', a: 'Yes! Download the transparent PNG, then use any image editor (or our Image Editor tool) to place it on a new background of your choice.' },
    { q: 'Does it work with product photos?', a: 'Absolutely! Background removal is perfect for e-commerce product photos. Get clean, professional product images ready for any marketplace.' },
  ],
  relatedTools: pick(imageToolLinks, '/remove-background'),
};

export const imageEditorData = {
  howItWorks: [
    { step: '1', title: 'Upload Image', desc: 'Upload any image to start editing. All popular formats supported.' },
    { step: '2', title: 'Edit & Adjust', desc: 'Apply brightness, contrast, saturation, blur, sharpen, and other adjustments with real-time preview.' },
    { step: '3', title: 'Download Edited', desc: 'Download your edited image in high quality. All changes are applied non-destructively.' },
  ],
  features: [
    { icon: '🎨', title: 'Color Adjustments', desc: 'Fine-tune brightness, contrast, saturation, hue, and exposure. Transform the mood and feel of any photo.' },
    { icon: '✨', title: 'Sharpen & Blur', desc: 'Sharpen details for crisp images or apply blur for depth-of-field effects and privacy masking.' },
    { icon: '🖼️', title: 'Filters & Effects', desc: 'Apply professional-grade filters including grayscale, sepia, vintage, and more with adjustable intensity.' },
    { icon: '👁️', title: 'Live Preview', desc: 'See all adjustments in real-time. Compare before and after with our side-by-side preview mode.' },
    { icon: '📏', title: 'Resize & Crop', desc: 'Built-in resize and crop tools for a complete editing workflow without switching between tools.' },
    { icon: '💾', title: 'Multiple Formats', desc: 'Export your edited images as JPG, PNG, or WebP with customizable quality settings.' },
  ],
  contentTitle: 'Online Image Editing Guide',
  contentSections: [
    { heading: 'Professional Editing Without Software', text: 'Our online image editor provides the essential tools you need for photo editing without installing expensive software like Photoshop. Adjust exposure, enhance colors, apply sharpening, add artistic effects, and export in multiple formats — all from your browser. Perfect for quick edits, social media content creation, and professional photo touch-ups.' },
    { heading: 'Tips for Better Photo Editing', text: 'Start with exposure and brightness adjustments to set the overall tone. Then adjust contrast to add depth. Fine-tune saturation for vibrant colors without oversaturation. Use sharpening sparingly — a little goes a long way. For portraits, slightly reduce contrast and increase brightness for a flattering look. For landscapes, boost contrast and saturation for dramatic impact.' },
  ],
  faqs: [
    { q: 'Is this a full replacement for Photoshop?', a: 'Our editor covers essential adjustments like brightness, contrast, saturation, filters, and effects. For advanced features like layers, masking, and vector graphics, desktop software may be needed.' },
    { q: 'Can I undo changes?', a: 'Yes, you can adjust or reset any setting before downloading. All changes are applied non-destructively to the preview, so you can experiment freely.' },
    { q: 'What export formats are available?', a: 'You can export edited images as JPG, PNG, or WebP with customizable quality settings for each format.' },
    { q: 'Does editing reduce image quality?', a: 'Our server-side processing maintains maximum quality throughout the editing pipeline. The output quality matches or exceeds the input quality.' },
  ],
  relatedTools: pick(imageToolLinks, '/image-editor'),
};

export const imageToPdfData = {
  howItWorks: [
    { step: '1', title: 'Upload Images', desc: 'Upload one or more images (JPG, PNG, WebP, etc.). Drag to reorder them in your preferred sequence.' },
    { step: '2', title: 'Arrange Order', desc: 'Drag and drop to rearrange the page order. Each image becomes one page in the final PDF.' },
    { step: '3', title: 'Download PDF', desc: 'Click convert and download your PDF instantly. All images are combined into a single, shareable document.' },
  ],
  features: [
    { icon: '📸', title: 'Multiple Images', desc: 'Combine up to 200 images into a single PDF. Perfect for photo albums, scanned documents, and presentations.' },
    { icon: '🔀', title: 'Drag to Reorder', desc: 'Easily reorder images by dragging them into your preferred sequence before conversion.' },
    { icon: '📄', title: 'Perfect Page Fit', desc: 'Each image is automatically sized to fit standard page dimensions while maintaining its original aspect ratio.' },
    { icon: '⚡', title: 'Instant Conversion', desc: 'Server-side processing converts even large batches of images to PDF in seconds.' },
    { icon: '🔒', title: 'Private & Secure', desc: 'Images are processed in memory and never stored. Your photos remain completely private.' },
    { icon: '📱', title: 'Works on Mobile', desc: 'Upload photos directly from your phone camera roll and create PDFs on the go.' },
  ],
  contentTitle: 'Complete Guide to Image-to-PDF Conversion',
  contentSections: [
    { heading: 'Why Convert Images to PDF?', text: 'PDF is the universal document format that looks the same on every device and operating system. Converting images to PDF is essential for creating professional documents from scanned papers, combining multiple photos into a single shareable file, creating digital portfolios, preparing documents for printing, and archiving visual content in a universally accessible format.' },
    { heading: 'Supported Image Formats', text: 'Our converter supports all major image formats including JPEG, PNG, GIF, BMP, WebP, TIFF, HEIC (iPhone photos), and ICO. Each image is automatically converted to a format optimized for PDF embedding while maintaining the highest possible quality. Images larger than 3000 pixels are intelligently downscaled to keep the PDF file size manageable.' },
  ],
  faqs: [
    { q: 'How many images can I combine into one PDF?', a: 'You can combine up to 200 images into a single PDF document. Each image becomes one page.' },
    { q: 'Can I change the order of pages?', a: 'Yes! Use drag-and-drop to rearrange images in your preferred order before converting. You can also use the up/down arrow buttons.' },
    { q: 'What is the maximum file size for each image?', a: 'Each individual image can be up to 20 MB. The total upload limit is 100 MB.' },
    { q: 'Will my images lose quality in the PDF?', a: 'Images are embedded at high quality (85% JPEG). For most purposes, the quality difference is imperceptible while keeping file sizes reasonable.' },
    { q: 'Can I convert iPhone HEIC photos?', a: 'Yes! HEIC/HEIF photos from iPhones are fully supported and will be automatically converted for PDF embedding.' },
  ],
  relatedTools: pick(pdfToolLinks, '/image-to-pdf'),
};

// ═══════════════════════════════════════════════════════════════════════════
//  PDF TOOLS
// ═══════════════════════════════════════════════════════════════════════════

export const pdfMergerData = {
  howItWorks: [
    { step: '1', title: 'Upload PDFs', desc: 'Upload two or more PDF files. Drag and drop multiple files at once for convenience.' },
    { step: '2', title: 'Arrange Order', desc: 'Drag to reorder the PDFs in your preferred sequence. The files will be merged in this exact order.' },
    { step: '3', title: 'Download Merged', desc: 'Click merge and download your combined PDF. All pages from all files in one document.' },
  ],
  features: [
    { icon: '📑', title: 'Merge Unlimited PDFs', desc: 'Combine as many PDF files as you need into a single document. No limit on the number of files.' },
    { icon: '🔀', title: 'Drag to Reorder', desc: 'Easily rearrange files by dragging them into your preferred order before merging.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Server-side merging handles even large PDFs with hundreds of pages in seconds.' },
    { icon: '📋', title: 'Preserves Quality', desc: 'Original formatting, fonts, images, and links are perfectly preserved in the merged output.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'All files are processed in memory and deleted immediately. Your documents are never stored on our servers.' },
    { icon: '🆓', title: 'Free Forever', desc: 'No sign-up, no watermarks, no file limits. Merge PDFs as often as you need at no cost.' },
  ],
  contentTitle: 'Everything About PDF Merging',
  contentSections: [
    { heading: 'Why Merge PDF Files?', text: 'Merging PDFs is essential for combining related documents into a single file — whether it is assembling a complete report from multiple chapters, combining scanned pages into one document, creating a unified proposal from separate sections, or organizing receipts and invoices into a single archive. A merged PDF is easier to share, print, and manage than multiple separate files.' },
    { heading: 'How Our PDF Merger Works', text: 'Our tool uses PyPDF2, a robust Python library for PDF manipulation. When you merge files, we read each PDF in sequence, extract all pages while preserving their original formatting, fonts, embedded images, hyperlinks, and bookmarks, then write them into a new combined PDF. The process happens entirely in server memory for maximum speed and security — no temporary files are written to disk.' },
    { heading: 'Tips for Merging PDFs', text: 'Before merging, arrange your files in the correct order using our drag-and-drop interface. If some PDFs are password-protected, unlock them first using our PDF Unlock tool. For very large merges (100+ pages), the process may take a few extra seconds. The merged file size will be approximately equal to the sum of all input file sizes.' },
  ],
  faqs: [
    { q: 'Is there a limit on how many PDFs I can merge?', a: 'No! You can merge as many PDF files as you need. The total upload size is limited to 100 MB, but there is no limit on the number of individual files.' },
    { q: 'Will merging preserve my PDF formatting?', a: 'Yes. All original formatting, fonts, images, hyperlinks, form fields, and bookmarks are preserved in the merged document.' },
    { q: 'Can I merge password-protected PDFs?', a: 'Password-protected PDFs need to be unlocked first. Use our PDF Unlock tool to remove the password, then merge the unlocked files.' },
    { q: 'Can I change the page order?', a: 'Yes! Drag and drop files to arrange them in your preferred order. The pages will appear in the merged PDF in the exact sequence you specify.' },
    { q: 'Are my files stored after merging?', a: 'No. All uploaded files and the merged result are processed in memory and immediately discarded. Nothing is ever saved to our servers.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-merge'),
};

export const pdfSplitterData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload the PDF file you want to split. Supports files with any number of pages.' },
    { step: '2', title: 'Choose Pages', desc: 'Select which pages to extract — individual pages, page ranges, or split every page into a separate file.' },
    { step: '3', title: 'Download Split Files', desc: 'Download your extracted pages as individual PDFs or as a combined ZIP archive.' },
  ],
  features: [
    { icon: '✂️', title: 'Flexible Splitting', desc: 'Extract specific pages, page ranges, or split every single page into its own PDF file.' },
    { icon: '📄', title: 'Page Preview', desc: 'See all pages in your PDF before splitting so you know exactly which pages to extract.' },
    { icon: '📦', title: 'ZIP Download', desc: 'When splitting into multiple files, download them all at once in a convenient ZIP archive.' },
    { icon: '📋', title: 'Quality Preserved', desc: 'Split pages retain all original formatting, fonts, images, and interactive elements.' },
    { icon: '🔒', title: 'Secure Processing', desc: 'Your PDF is processed in memory and never saved to disk. Complete privacy guaranteed.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Even large PDFs with hundreds of pages are split in seconds with our optimized processing engine.' },
  ],
  contentTitle: 'Guide to Splitting PDF Files',
  contentSections: [
    { heading: 'When to Split a PDF', text: 'PDF splitting is useful when you need to extract specific chapters from a large document, send only certain pages to a colleague, separate a scanned multi-page document into individual files, remove unwanted pages from a PDF, or break a large file into smaller chunks for easier email attachment. Our tool makes this process quick and painless.' },
    { heading: 'Splitting Options Explained', text: 'Our splitter offers three main modes: extract specific pages (enter page numbers like 1, 3, 5-8), split into ranges (create multiple PDFs from defined page ranges), and split all pages (create one PDF per page). All modes preserve the original quality, formatting, and metadata of the source PDF.' },
  ],
  faqs: [
    { q: 'Can I extract specific pages from a PDF?', a: 'Yes! Enter the page numbers or ranges you want to extract (e.g., "1, 3, 5-8"). The selected pages will be combined into a new PDF.' },
    { q: 'Can I split every page into a separate file?', a: 'Yes! Choose the "split all" option to create individual PDF files for each page. They will be downloaded as a ZIP archive.' },
    { q: 'Does splitting affect the quality?', a: 'No. Split pages are exact copies of the originals with all formatting, fonts, and images perfectly preserved.' },
    { q: 'Is there a page limit?', a: 'No page limit. You can split PDFs with hundreds or even thousands of pages. The only limit is the 100 MB file size cap.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-split'),
};

export const pdfCompressorData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload the PDF file you want to compress. Supports all standard PDF files up to 100 MB.' },
    { step: '2', title: 'Choose Compression', desc: 'Select compression level — light (minimal quality loss), medium (balanced), or strong (maximum reduction).' },
    { step: '3', title: 'Download Compressed', desc: 'Download your compressed PDF with significantly reduced file size. Compare before and after sizes.' },
  ],
  features: [
    { icon: '🗜️', title: 'Smart Compression', desc: 'Intelligent algorithms compress images and optimize PDF structure while maintaining readable text and clear graphics.' },
    { icon: '📊', title: 'Size Comparison', desc: 'See the original and compressed file sizes side by side. Know exactly how much space you saved.' },
    { icon: '📧', title: 'Email Ready', desc: 'Compress large PDFs to fit within email attachment limits (typically 10-25 MB). Send documents without bouncing.' },
    { icon: '📋', title: 'Text Preserved', desc: 'Text, fonts, and vector graphics remain crisp and clear. Only embedded images are recompressed for size savings.' },
    { icon: '🔒', title: 'Private & Secure', desc: 'Files are compressed in memory and never stored. Your sensitive documents remain completely confidential.' },
    { icon: '🆓', title: 'No Limits', desc: 'Compress as many PDFs as you need. No daily limits, no accounts, no watermarks, completely free.' },
  ],
  contentTitle: 'PDF Compression Guide',
  contentSections: [
    { heading: 'Why Compress PDFs?', text: 'Large PDF files are difficult to email, slow to upload and download, and consume excessive storage space. PDF compression reduces file size by optimizing embedded images, removing redundant data, and streamlining the internal PDF structure. A well-compressed PDF can be 50-90% smaller than the original while remaining perfectly readable and printable.' },
    { heading: 'How PDF Compression Works', text: 'Our compressor analyzes each component of your PDF separately. Embedded images (the biggest contributor to file size) are recompressed with optimized settings. Duplicate resources are eliminated. PDF streams are compressed with efficient algorithms. Metadata and structural overhead are minimized. The result is a significantly smaller file that looks virtually identical to the original.' },
  ],
  faqs: [
    { q: 'How much can the file size be reduced?', a: 'Typical reductions range from 40% to 90% depending on the content. PDFs with many large images see the biggest reductions. Text-heavy PDFs with few images may see smaller gains.' },
    { q: 'Will compression affect text quality?', a: 'No. Text, fonts, and vector graphics are preserved at full quality. Only embedded raster images are recompressed, and our algorithms minimize visible quality loss.' },
    { q: 'Can I compress a password-protected PDF?', a: 'Password-protected PDFs need to be unlocked first. Use our PDF Unlock tool, then compress the unlocked file.' },
    { q: 'Is there a file size limit?', a: 'You can upload PDFs up to 100 MB in size. The compressed output will be significantly smaller.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-compressor'),
};

export const pdfToWordData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload the PDF document you want to convert to an editable Word file.' },
    { step: '2', title: 'AI Conversion', desc: 'Our engine analyzes the PDF structure, extracts text, tables, and images, and reconstructs them in Word format.' },
    { step: '3', title: 'Download DOCX', desc: 'Download your editable Word document. Open it in Microsoft Word, Google Docs, or any compatible editor.' },
  ],
  features: [
    { icon: '📝', title: 'Editable Output', desc: 'Get a fully editable Word document with selectable text, editable tables, and repositionable images.' },
    { icon: '📊', title: 'Table Extraction', desc: 'Tables in your PDF are accurately reconstructed as editable Word tables with proper cell structure.' },
    { icon: '🖼️', title: 'Image Preservation', desc: 'All images and graphics from the PDF are extracted and embedded in the Word document at full quality.' },
    { icon: '🔤', title: 'Font Matching', desc: 'Our converter attempts to match the original fonts and formatting as closely as possible for accurate reproduction.' },
    { icon: '⚡', title: 'Fast Conversion', desc: 'Most PDFs are converted in under 10 seconds, even multi-page documents with complex layouts.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your documents are processed securely and deleted immediately after conversion. Nothing is stored.' },
  ],
  contentTitle: 'PDF to Word Conversion Guide',
  contentSections: [
    { heading: 'Why Convert PDF to Word?', text: 'PDFs are great for sharing final documents, but when you need to edit the content, Word format is far more practical. Converting PDF to Word lets you modify text, update tables, rearrange content, add comments, and collaborate with others using track changes. This is essential for editing contracts, updating reports, modifying proposals, and working with any document that was originally shared as a PDF.' },
    { heading: 'What to Expect from the Conversion', text: 'Our converter handles text, paragraphs, headings, tables, images, and basic formatting. Complex layouts like multi-column pages, unusual fonts, or heavily designed PDFs may require some manual adjustment after conversion. Scanned PDFs (image-based) will need OCR processing first — use our OCR Scanner tool to extract text before converting.' },
  ],
  faqs: [
    { q: 'Will the Word document look exactly like my PDF?', a: 'The conversion preserves text content, tables, and images with high accuracy. Some complex layouts or unusual fonts may require minor manual adjustments.' },
    { q: 'Can I convert scanned PDFs?', a: 'Scanned PDFs (images of text) need OCR processing first. Use our OCR Scanner tool to extract text, then convert to Word.' },
    { q: 'What Word format is the output?', a: 'The output is a standard .docx file compatible with Microsoft Word 2007 and later, Google Docs, LibreOffice Writer, and other word processors.' },
    { q: 'Is there a page limit?', a: 'No page limit. You can convert PDFs with any number of pages. The file size limit is 100 MB.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-to-word'),
};

export const pdfToExcelData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload a PDF containing tables or tabular data that you want to extract to Excel.' },
    { step: '2', title: 'Table Extraction', desc: 'Our engine detects and extracts tables from your PDF, converting them to Excel spreadsheet format.' },
    { step: '3', title: 'Download Excel', desc: 'Download your Excel file (.xlsx) with all extracted tables ready for analysis and editing.' },
  ],
  features: [
    { icon: '📊', title: 'Smart Detection', desc: 'Automatically detects tables in your PDF, even complex multi-column layouts with merged cells.' },
    { icon: '📋', title: 'Accurate Extraction', desc: 'Data is extracted with high accuracy, preserving cell values, column alignment, and table structure.' },
    { icon: '📈', title: 'Excel Ready', desc: 'Output is a standard .xlsx file ready for use in Microsoft Excel, Google Sheets, or any spreadsheet app.' },
    { icon: '🔢', title: 'Number Formatting', desc: 'Numeric values are correctly typed as numbers in Excel, allowing immediate use in formulas and charts.' },
    { icon: '⚡', title: 'Quick Processing', desc: 'Tables are extracted in seconds, even from large PDFs with many pages of tabular data.' },
    { icon: '🔒', title: 'Private & Secure', desc: 'Your financial and business data remains confidential. Files are processed in memory and never stored.' },
  ],
  contentTitle: 'PDF to Excel Conversion Guide',
  contentSections: [
    { heading: 'When to Convert PDF Tables to Excel', text: 'Financial reports, bank statements, invoices, scientific data, government reports, and many other documents are distributed as PDFs with tabular data that you need to analyze, chart, or process further. Manually retyping this data is tedious and error-prone. Our PDF to Excel converter extracts tables automatically, saving hours of manual work and eliminating data entry errors.' },
    { heading: 'Tips for Best Results', text: 'For optimal extraction accuracy, ensure your PDF has clearly defined table structures with visible borders or consistent spacing. Scanned PDFs may need OCR processing first. Multi-page tables that span across pages are handled automatically. If your PDF contains both text and tables, only the tabular data will be extracted to the Excel file.' },
  ],
  faqs: [
    { q: 'What types of PDFs work best?', a: 'PDFs with clearly structured tables — visible borders, consistent column spacing, and proper text encoding — yield the best results. Digital PDFs work better than scanned documents.' },
    { q: 'Can I convert scanned PDF tables?', a: 'Scanned PDFs may need OCR processing first. Use our OCR Scanner to convert the scanned image to text, then extract tables.' },
    { q: 'Will formulas be preserved?', a: 'PDFs do not contain formulas — only the visible cell values. The extracted data is placed as static values in Excel, where you can add your own formulas.' },
    { q: 'Can I extract multiple tables from one PDF?', a: 'Yes! All tables found in the PDF are extracted and placed into the Excel file, each in its proper position.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-to-excel'),
};

export const pdfToPowerPointData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload the PDF you want to convert to a PowerPoint presentation.' },
    { step: '2', title: 'Conversion', desc: 'Each PDF page is converted to a PowerPoint slide with layout and content preserved.' },
    { step: '3', title: 'Download PPTX', desc: 'Download your PowerPoint file ready for editing and presenting.' },
  ],
  features: [
    { icon: '📽️', title: 'Slide Conversion', desc: 'Each PDF page becomes an editable PowerPoint slide with preserved layout and visual elements.' },
    { icon: '🖼️', title: 'Image Quality', desc: 'Images and graphics from the PDF are rendered at high resolution for crisp presentation slides.' },
    { icon: '📝', title: 'Editable Content', desc: 'Text and images in the output are editable in PowerPoint, allowing you to customize the presentation.' },
    { icon: '🎨', title: 'Layout Preserved', desc: 'Page layouts, colors, and visual hierarchy from the original PDF are maintained in the slides.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Convert PDFs to PowerPoint in seconds, even for presentations with dozens of slides.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your presentations are processed securely and never stored on our servers.' },
  ],
  contentTitle: 'PDF to PowerPoint Conversion Guide',
  contentSections: [
    { heading: 'Why Convert PDF to PowerPoint?', text: 'When you receive a presentation as a PDF and need to edit, customize, or present it, converting to PowerPoint gives you full editing control. You can modify text, rearrange slides, add animations, change designs, and present using PowerPoint\'s slideshow mode. This is essential for updating received presentations, repurposing content, and preparing for meetings.' },
    { heading: 'What to Expect', text: 'Each page of your PDF becomes a slide in the PowerPoint file. Text elements are extracted as editable text boxes. Images are embedded at their original quality. Complex layouts with multiple text blocks and images are preserved as closely as possible. Some manual adjustment may be needed for PDFs with very complex or unusual layouts.' },
  ],
  faqs: [
    { q: 'Will each PDF page become a separate slide?', a: 'Yes, each page of the PDF is converted into one PowerPoint slide, maintaining the original layout and content.' },
    { q: 'Can I edit the converted slides?', a: 'Yes! The output is a fully editable .pptx file. You can modify text, move images, add animations, and customize the design.' },
    { q: 'What file format is the output?', a: 'The output is a .pptx file compatible with Microsoft PowerPoint 2007 and later, Google Slides, and other presentation software.' },
    { q: 'Is there a limit on the number of pages?', a: 'No page limit. Convert PDFs with any number of pages. File size is limited to 100 MB.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-to-powerpoint'),
};

export const pdfProtectData = {
  howItWorks: [
    { step: '1', title: 'Upload PDF', desc: 'Upload the PDF file you want to protect with a password.' },
    { step: '2', title: 'Set Password', desc: 'Enter a strong password. This password will be required to open the protected PDF.' },
    { step: '3', title: 'Download Protected', desc: 'Download your password-protected PDF. Only people with the password can open it.' },
  ],
  features: [
    { icon: '🔒', title: 'AES Encryption', desc: 'Industry-standard AES encryption protects your PDF. The strongest level of password protection available.' },
    { icon: '🔑', title: 'Custom Password', desc: 'Set your own password of any length and complexity. Use strong passwords for maximum security.' },
    { icon: '📋', title: 'Content Preserved', desc: 'All content, formatting, images, and interactive elements remain intact inside the protected PDF.' },
    { icon: '⚡', title: 'Instant Protection', desc: 'Password protection is applied in seconds, even for large multi-page documents.' },
    { icon: '🛡️', title: 'Opening Password', desc: 'Recipients must enter the correct password to open and view the document. Unauthorized users are blocked.' },
    { icon: '🆓', title: 'Free & Private', desc: 'Protect unlimited PDFs for free. We never see or store your passwords.' },
  ],
  contentTitle: 'PDF Password Protection Guide',
  contentSections: [
    { heading: 'Why Protect Your PDFs?', text: 'Password-protecting PDFs is essential when sharing sensitive information like financial documents, contracts, medical records, personal identification, and confidential business reports. Adding a password ensures that only authorized recipients can open and view the document, providing a crucial layer of security for email attachments and file sharing.' },
    { heading: 'Creating Strong Passwords', text: 'Use a password of at least 12 characters combining uppercase letters, lowercase letters, numbers, and special characters. Avoid common words, personal information, and sequential patterns. Consider using a passphrase — a series of random words like "correct-horse-battery-staple" — which is both secure and memorable. Share the password separately from the PDF (e.g., via a different communication channel).' },
  ],
  faqs: [
    { q: 'What type of encryption is used?', a: 'We use AES (Advanced Encryption Standard) encryption, which is the same encryption standard used by banks and governments worldwide.' },
    { q: 'Can I remove the password later?', a: 'Yes! Use our PDF Unlock tool to remove the password from a protected PDF. You will need the original password to unlock it.' },
    { q: 'Is my password stored on your servers?', a: 'No! We never store or log your passwords. The encryption is applied in memory and all data is discarded immediately after processing.' },
    { q: 'Will protection change the PDF content?', a: 'No. Password protection only adds an encryption layer around the existing PDF. All content, formatting, and structure remain completely unchanged.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-protect'),
};

export const pdfUnlockData = {
  howItWorks: [
    { step: '1', title: 'Upload Locked PDF', desc: 'Upload the password-protected PDF file you need to unlock.' },
    { step: '2', title: 'Enter Password', desc: 'Enter the password for the protected PDF. We need the correct password to decrypt the file.' },
    { step: '3', title: 'Download Unlocked', desc: 'Download the unlocked PDF without password restrictions. Open it freely on any device.' },
  ],
  features: [
    { icon: '🔓', title: 'Remove Passwords', desc: 'Remove the opening password from protected PDFs so you can open them freely without entering a password each time.' },
    { icon: '✅', title: 'Legal & Ethical', desc: 'Unlock your own PDFs when you know the password. Designed for legitimate use with authorized documents.' },
    { icon: '📋', title: 'Content Preserved', desc: 'The unlocked PDF contains all original content, formatting, images, and interactive elements unchanged.' },
    { icon: '⚡', title: 'Instant Unlock', desc: 'PDFs are decrypted in seconds. No waiting for lengthy processing times.' },
    { icon: '🔒', title: 'Secure Process', desc: 'Your password is used only for decryption and is never stored or logged. Complete privacy guaranteed.' },
    { icon: '🆓', title: 'Free Service', desc: 'Unlock unlimited PDFs at no cost. No sign-up required.' },
  ],
  contentTitle: 'PDF Unlocking Guide',
  contentSections: [
    { heading: 'When to Unlock a PDF', text: 'You may need to unlock a PDF when you have forgotten the password to your own protected document, when you need to edit a protected PDF you created earlier, when merging password-protected documents into a combined file, or when you need to compress a protected PDF to reduce its file size. Our tool requires the correct password to unlock — it is designed for authorized document access only.' },
    { heading: 'Understanding PDF Security', text: 'PDFs can have two types of passwords: an opening (user) password that prevents viewing, and a permissions (owner) password that restricts editing, printing, and copying. Our unlock tool removes the opening password, creating a freely accessible version of the document. For security, always keep the original password-protected version as a backup.' },
  ],
  faqs: [
    { q: 'Do I need to know the password?', a: 'Yes, you need the correct password to unlock the PDF. Our tool decrypts the file using the password you provide — it does not crack or bypass passwords.' },
    { q: 'Is unlocking PDFs legal?', a: 'Yes, when you are the owner of the document or have been given the password by the owner. Our tool is designed for legitimate, authorized access to your own documents.' },
    { q: 'Will unlocking change the content?', a: 'No. The unlocked PDF is identical to the original in every way except the password restriction has been removed.' },
    { q: 'Can I re-protect the PDF after unlocking?', a: 'Yes! Use our PDF Protect tool to add a new password to the unlocked PDF if you want to re-secure it with a different password.' },
  ],
  relatedTools: pick(pdfToolLinks, '/pdf-unlock'),
};

export const wordToPdfData = {
  howItWorks: [
    { step: '1', title: 'Upload Word File', desc: 'Upload your Word document (.doc or .docx format) by dragging and dropping or clicking to browse.' },
    { step: '2', title: 'Automatic Conversion', desc: 'Our engine converts your Word document to a high-quality PDF preserving all formatting and layout.' },
    { step: '3', title: 'Download PDF', desc: 'Download your converted PDF file. The document looks identical to the original Word file.' },
  ],
  features: [
    { icon: '📄', title: 'Perfect Conversion', desc: 'Word formatting, fonts, tables, images, headers, footers, and page numbers are all preserved in the PDF output.' },
    { icon: '🔤', title: 'Font Embedding', desc: 'Fonts are embedded in the PDF ensuring your document looks the same on every device and operating system.' },
    { icon: '📊', title: 'Table Support', desc: 'Complex tables with merged cells, borders, and formatting are accurately rendered in the PDF.' },
    { icon: '🖼️', title: 'Image Quality', desc: 'All images, charts, and graphics from your Word document are included at their original quality in the PDF.' },
    { icon: '⚡', title: 'Fast & Reliable', desc: 'Most documents are converted in under 5 seconds. Our engine handles even complex multi-page documents reliably.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your documents are processed securely and deleted immediately. Nothing is ever stored on our servers.' },
  ],
  contentTitle: 'Word to PDF Conversion Guide',
  contentSections: [
    { heading: 'Why Convert Word to PDF?', text: 'PDF is the standard format for sharing final documents because it preserves formatting across all devices and platforms. Word documents may look different depending on the installed fonts, Word version, and operating system. Converting to PDF ensures your document looks exactly as intended — whether opened on Windows, Mac, Linux, or mobile devices. PDFs are also preferred for formal submissions, contracts, resumes, and any document where formatting integrity is critical.' },
    { heading: 'Supported Word Formats', text: 'We support both .doc (legacy Word 97-2003 format) and .docx (modern Word 2007+ format). Both formats are converted with high fidelity using server-side LibreOffice processing, which provides the most accurate rendering of Word document features including styles, themes, SmartArt, and complex page layouts.' },
  ],
  faqs: [
    { q: 'Will my Word formatting be preserved?', a: 'Yes! Fonts, tables, images, headers, footers, page numbers, styles, and most Word formatting features are accurately preserved in the PDF output.' },
    { q: 'Can I convert .doc files (older format)?', a: 'Yes, we support both .doc (Word 97-2003) and .docx (Word 2007+) formats. Both are converted with high accuracy.' },
    { q: 'What about embedded images and charts?', a: 'All embedded images, charts, SmartArt graphics, and other visual elements are included in the PDF at their original quality.' },
    { q: 'Is there a page limit?', a: 'No page limit. You can convert Word documents with any number of pages. The file size limit is 100 MB.' },
  ],
  relatedTools: pick(pdfToolLinks, '/word-to-pdf'),
};

// ═══════════════════════════════════════════════════════════════════════════
//  DOCUMENT TOOLS
// ═══════════════════════════════════════════════════════════════════════════

export const wordConverterData = {
  howItWorks: [
    { step: '1', title: 'Upload Word File', desc: 'Upload your Word document (.doc or .docx) for conversion to other formats.' },
    { step: '2', title: 'Choose Format', desc: 'Select the output format — PDF, TXT, HTML, RTF, ODT, and more.' },
    { step: '3', title: 'Download Converted', desc: 'Download your converted document in the chosen format instantly.' },
  ],
  features: [
    { icon: '📝', title: 'Multiple Formats', desc: 'Convert Word documents to PDF, TXT, HTML, RTF, ODT, and other popular document formats.' },
    { icon: '📋', title: 'Formatting Preserved', desc: 'Document formatting, styles, tables, and images are preserved as much as the target format allows.' },
    { icon: '⚡', title: 'Fast Conversion', desc: 'Documents are converted in seconds using server-side processing with LibreOffice engine.' },
    { icon: '🔄', title: 'Two-Way Conversion', desc: 'Convert from Word to other formats or convert other formats to Word. Full bidirectional support.' },
    { icon: '🔒', title: 'Secure Processing', desc: 'Your documents are processed securely and deleted immediately after conversion.' },
    { icon: '🆓', title: 'Free Forever', desc: 'No limits, no sign-up, no watermarks. Convert as many documents as you need.' },
  ],
  contentTitle: 'Word Document Conversion Guide',
  contentSections: [
    { heading: 'Converting Between Document Formats', text: 'Different situations require different document formats. Need to share a document that looks the same everywhere? Convert to PDF. Need plain text for data processing? Convert to TXT. Need to publish online? Convert to HTML. Need compatibility with OpenDocument editors? Convert to ODT. Our converter handles all these scenarios with high-fidelity output.' },
    { heading: 'Supported Conversions', text: 'Input: DOC, DOCX. Output: PDF, TXT, HTML, RTF, ODT, EPUB, and more. The conversion engine uses LibreOffice\'s rendering technology for the most accurate format conversion possible, handling complex features like styles, headers, footers, images, and table formatting.' },
  ],
  faqs: [
    { q: 'What formats can I convert Word documents to?', a: 'You can convert to PDF, TXT, HTML, RTF, ODT, and several other formats. We are continuously adding more output options.' },
    { q: 'Will formatting be preserved?', a: 'Formatting is preserved as much as the target format supports. PDF preserves nearly everything, while TXT will strip all formatting and keep only text.' },
    { q: 'Can I convert back to Word from other formats?', a: 'Yes! Our converter supports bidirectional conversion. You can convert from other formats back to DOCX.' },
  ],
  relatedTools: pick(docToolLinks, '/word-converter'),
};

export const excelConverterData = {
  howItWorks: [
    { step: '1', title: 'Upload Spreadsheet', desc: 'Upload your Excel file (.xls or .xlsx) for conversion.' },
    { step: '2', title: 'Choose Format', desc: 'Select the output format — CSV, PDF, ODS, HTML, or other supported formats.' },
    { step: '3', title: 'Download Converted', desc: 'Download your converted spreadsheet in the chosen format.' },
  ],
  features: [
    { icon: '📊', title: 'Multiple Formats', desc: 'Convert Excel to CSV, PDF, ODS, HTML, TSV, and other spreadsheet and document formats.' },
    { icon: '📋', title: 'Data Preserved', desc: 'All cell values, formulas (where supported), formatting, and sheet structure are preserved in the output.' },
    { icon: '📈', title: 'Multi-Sheet Support', desc: 'Handle workbooks with multiple sheets. All sheets are included in the converted output.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Spreadsheets are converted quickly, even large files with thousands of rows and multiple sheets.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your financial data and spreadsheets are processed securely and never stored on our servers.' },
    { icon: '🆓', title: 'Free & Unlimited', desc: 'Convert as many spreadsheets as you need with no limits, no accounts, and no watermarks.' },
  ],
  contentTitle: 'Excel Conversion Guide',
  contentSections: [
    { heading: 'Why Convert Excel Files?', text: 'Converting Excel files to other formats is necessary for data sharing (CSV is universally compatible), printing (PDF preserves layout), web publishing (HTML for browser viewing), and cross-platform compatibility (ODS for LibreOffice users). Our converter handles all these use cases with accurate data preservation and formatting.' },
    { heading: 'Understanding Spreadsheet Formats', text: 'XLSX is Microsoft\'s modern Excel format with rich formatting. CSV is a plain-text format that stores only cell values separated by commas — perfect for data import/export but loses formatting. ODS is the open standard used by LibreOffice. PDF preserves the visual layout for printing and sharing. Choose the format that best fits your needs.' },
  ],
  faqs: [
    { q: 'Will formulas be preserved in the conversion?', a: 'Formulas are preserved when converting between spreadsheet formats (XLSX to ODS). When converting to CSV or PDF, only the calculated values are included.' },
    { q: 'Can I convert large spreadsheets?', a: 'Yes! We handle spreadsheets with thousands of rows and multiple sheets. The file size limit is 100 MB.' },
    { q: 'What about formatting and styles?', a: 'Formatting is preserved when converting to formats that support it (PDF, ODS). CSV and TSV formats contain only raw data without formatting.' },
  ],
  relatedTools: pick(docToolLinks, '/excel-converter'),
};

export const pptConverterData = {
  howItWorks: [
    { step: '1', title: 'Upload Presentation', desc: 'Upload your PowerPoint file (.ppt or .pptx) for conversion.' },
    { step: '2', title: 'Choose Format', desc: 'Select the output format — PDF, images, ODP, or other supported formats.' },
    { step: '3', title: 'Download Converted', desc: 'Download your converted presentation instantly.' },
  ],
  features: [
    { icon: '📽️', title: 'Multiple Outputs', desc: 'Convert PowerPoint to PDF, images (one per slide), ODP, and other presentation formats.' },
    { icon: '🎨', title: 'Design Preserved', desc: 'Slide designs, themes, fonts, images, and layouts are preserved in the converted output.' },
    { icon: '📄', title: 'PDF Conversion', desc: 'Create a perfect PDF version of your presentation for sharing with people who do not have PowerPoint.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Presentations are converted in seconds, even those with many slides and complex animations.' },
    { icon: '🔒', title: 'Secure Processing', desc: 'Your presentations are processed securely and never stored. Complete privacy guaranteed.' },
    { icon: '🆓', title: 'Free Forever', desc: 'Convert unlimited presentations with no restrictions, no sign-up, and no watermarks.' },
  ],
  contentTitle: 'PowerPoint Conversion Guide',
  contentSections: [
    { heading: 'Why Convert PowerPoint Files?', text: 'Converting PowerPoint to PDF is the most common conversion — it ensures your presentation looks exactly the same on every device without requiring PowerPoint software. Converting slides to images is useful for embedding in web pages, emails, and social media posts. Converting to ODP format provides compatibility with LibreOffice Impress and other open-source presentation software.' },
  ],
  faqs: [
    { q: 'Will slide animations be preserved?', a: 'Animations and transitions are not preserved in PDF or image output. The final visual state of each slide is captured. For editable formats like ODP, basic transitions may be preserved.' },
    { q: 'Can I convert to individual slide images?', a: 'Yes! Each slide can be exported as a separate high-resolution image (PNG or JPEG), perfect for web publishing or social media.' },
    { q: 'What about embedded videos?', a: 'Embedded videos are not included in PDF or image output. They may be referenced in editable format conversions.' },
  ],
  relatedTools: pick(docToolLinks, '/ppt-converter'),
};

export const textExtractorData = {
  howItWorks: [
    { step: '1', title: 'Upload Document', desc: 'Upload a PDF, Word, or other document from which you want to extract text.' },
    { step: '2', title: 'Text Extraction', desc: 'Our engine parses the document and extracts all readable text content.' },
    { step: '3', title: 'Download or Copy', desc: 'Download the extracted text as a TXT file or copy it directly to your clipboard.' },
  ],
  features: [
    { icon: '📄', title: 'Multi-Format Support', desc: 'Extract text from PDF, DOCX, PPTX, XLSX, TXT, and many other document formats.' },
    { icon: '📋', title: 'Clean Text Output', desc: 'Get clean, properly formatted text without embedded formatting codes, styles, or markup.' },
    { icon: '📝', title: 'Copy to Clipboard', desc: 'One-click copy extracted text to your clipboard for quick pasting into other applications.' },
    { icon: '⚡', title: 'Instant Extraction', desc: 'Text is extracted in seconds, even from large multi-page documents.' },
    { icon: '🔒', title: 'Private Processing', desc: 'Your documents are processed securely and never stored. Text extraction happens entirely in memory.' },
    { icon: '🆓', title: 'Free & Unlimited', desc: 'Extract text from as many documents as you need. No sign-up or limits.' },
  ],
  contentTitle: 'Text Extraction Guide',
  contentSections: [
    { heading: 'Why Extract Text from Documents?', text: 'Text extraction is essential for repurposing content from PDF reports, research papers, and ebooks into editable text. It is also used for data mining, content analysis, accessibility improvements (making document text available for screen readers), search engine indexing, and creating plain-text backups of formatted documents.' },
    { heading: 'Text Extraction vs OCR', text: 'Text extraction works on digital documents where the text is encoded as characters (created by word processors or generated digitally). OCR (Optical Character Recognition) is needed for scanned documents or images where the text exists as pixels rather than characters. If your PDF was created from a scan or photograph, use our OCR Scanner tool instead.' },
  ],
  faqs: [
    { q: 'What file types can I extract text from?', a: 'We support PDF, DOCX, DOC, PPTX, XLSX, TXT, RTF, and other common document formats. Upload any document and we will extract the readable text.' },
    { q: 'Does it work on scanned PDFs?', a: 'No, text extraction requires digital text encoding. For scanned documents or images, use our OCR Scanner tool which uses optical character recognition.' },
    { q: 'Is the formatting preserved?', a: 'The output is plain text. Formatting like bold, italic, fonts, and colors are removed. The text content and basic paragraph structure are preserved.' },
    { q: 'Can I extract text from images?', a: 'For images containing text, use our OCR Scanner tool. The Text Extractor works with digital document formats, not image files.' },
  ],
  relatedTools: pick(docToolLinks, '/text-extractor'),
};

export const ocrScannerData = {
  howItWorks: [
    { step: '1', title: 'Upload Image/PDF', desc: 'Upload a scanned document, photo of text, or image-based PDF that contains text you want to extract.' },
    { step: '2', title: 'OCR Processing', desc: 'Our Tesseract OCR engine analyzes the image and recognizes text characters with high accuracy.' },
    { step: '3', title: 'Get Editable Text', desc: 'Download the recognized text as a TXT file or copy it to your clipboard for use anywhere.' },
  ],
  features: [
    { icon: '🔍', title: 'Accurate Recognition', desc: 'Powered by Tesseract OCR, one of the most accurate open-source OCR engines. Handles multiple languages and font types.' },
    { icon: '📸', title: 'Image to Text', desc: 'Convert photographs of documents, whiteboards, signs, receipts, and any image with text into editable digital text.' },
    { icon: '📄', title: 'Scanned PDF Support', desc: 'Extract text from scanned PDFs (image-based PDFs) that cannot be copied or searched normally.' },
    { icon: '🌐', title: 'Multi-Language', desc: 'Recognize text in multiple languages including English, Spanish, French, German, Chinese, Japanese, and more.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'OCR processing completes in just a few seconds, even for multi-page scanned documents.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your scanned documents are processed securely and never stored. Complete confidentiality guaranteed.' },
  ],
  contentTitle: 'OCR Scanning Guide',
  contentSections: [
    { heading: 'What is OCR?', text: 'OCR (Optical Character Recognition) is the technology that converts images of text — such as scanned documents, photos of printed pages, or handwritten text — into machine-readable, editable digital text. OCR analyzes the visual patterns of characters in an image and matches them to known letter shapes using pattern recognition and machine learning algorithms.' },
    { heading: 'Tips for Better OCR Results', text: 'For the best OCR accuracy, use high-resolution scans (300 DPI or higher). Ensure the text is well-lit and clearly visible. Straighten any skewed or rotated pages before scanning. Use high contrast between text and background. Avoid shadows, wrinkles, and obstructions over the text. Clean, well-printed text in standard fonts gives the best recognition rates.' },
  ],
  faqs: [
    { q: 'How accurate is the OCR?', a: 'For clear, well-printed text in standard fonts, accuracy is typically 95-99%. Handwritten text, unusual fonts, and low-quality scans may have lower accuracy.' },
    { q: 'What image formats are supported?', a: 'We support JPG, PNG, TIFF, BMP, WebP, and PDF (image-based scanned PDFs). Most image formats with text content will work.' },
    { q: 'Can it recognize handwritten text?', a: 'OCR works best with printed text. Handwritten text recognition has lower accuracy and depends heavily on the clarity and consistency of the handwriting.' },
    { q: 'Does it support multiple languages?', a: 'Yes! Our OCR engine supports multiple languages including English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, and many more.' },
  ],
  relatedTools: pick(docToolLinks, '/ocr-scanner'),
};

export const documentMergerData = {
  howItWorks: [
    { step: '1', title: 'Upload Documents', desc: 'Upload multiple documents of the same type (Word, Excel, or PowerPoint files).' },
    { step: '2', title: 'Arrange Order', desc: 'Drag and drop to arrange the documents in your preferred merge order.' },
    { step: '3', title: 'Download Merged', desc: 'Download the single merged document with all content combined in order.' },
  ],
  features: [
    { icon: '📑', title: 'Multi-Format Merging', desc: 'Merge Word documents, Excel spreadsheets, and PowerPoint presentations. Each type combines seamlessly.' },
    { icon: '🔀', title: 'Custom Order', desc: 'Drag and drop files to set the exact merge order. Content appears in the merged file in your specified sequence.' },
    { icon: '📋', title: 'Formatting Preserved', desc: 'Original formatting, styles, images, and structure from each document are preserved in the merged output.' },
    { icon: '⚡', title: 'Fast Merging', desc: 'Documents are merged in seconds using server-side processing. No local software required.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your documents are processed in memory and never stored. Complete privacy for sensitive business documents.' },
    { icon: '🆓', title: 'Free Service', desc: 'Merge unlimited documents at no cost. No sign-up, no watermarks, no file limits.' },
  ],
  contentTitle: 'Document Merging Guide',
  contentSections: [
    { heading: 'When to Merge Documents', text: 'Document merging is essential when combining chapters into a complete book or report, assembling proposal sections from different team members, consolidating meeting notes into a single document, combining monthly reports into an annual summary, or merging data from multiple spreadsheets into one master file. Our tool handles all these scenarios quickly and accurately.' },
    { heading: 'Supported Document Types', text: 'Merge Word documents (DOC, DOCX) into a combined Word file. Merge Excel spreadsheets (XLS, XLSX) with multiple sheets preserved. Merge PowerPoint presentations (PPT, PPTX) with slides from all files combined in sequence. Each merge type uses specialized libraries to ensure the highest quality output with formatting preservation.' },
  ],
  faqs: [
    { q: 'Can I merge different file types together?', a: 'No, you need to merge files of the same type. For example, merge Word with Word, Excel with Excel, or PowerPoint with PowerPoint.' },
    { q: 'How many files can I merge at once?', a: 'You can merge as many files as needed. The total combined size should be under 100 MB.' },
    { q: 'Will formatting from all documents be preserved?', a: 'Yes. Each document\'s formatting, styles, images, and structure are preserved in the merged output.' },
    { q: 'Can I change the order of documents?', a: 'Yes! Use drag-and-drop to arrange files in your preferred order before merging.' },
  ],
  relatedTools: pick(docToolLinks, '/doc-merge'),
};

export const formatConverterData = {
  howItWorks: [
    { step: '1', title: 'Upload Document', desc: 'Upload any document file — Word, Excel, PowerPoint, PDF, or other supported format.' },
    { step: '2', title: 'Choose Target Format', desc: 'Select the output format you need from our extensive list of supported document types.' },
    { step: '3', title: 'Download Converted', desc: 'Download your document in the new format, ready for use in any compatible application.' },
  ],
  features: [
    { icon: '🔄', title: 'Universal Converter', desc: 'Convert between any combination of document formats — Word, Excel, PowerPoint, PDF, TXT, HTML, and more.' },
    { icon: '📋', title: 'High Fidelity', desc: 'Conversions preserve formatting, layout, images, and structure as accurately as possible between formats.' },
    { icon: '📦', title: 'Batch Support', desc: 'Convert multiple documents at once. Upload a batch and convert them all to the same target format.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Conversions complete in seconds using our optimized server-side processing engine.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'All conversions are processed in memory. Your documents are never stored on our servers.' },
    { icon: '🆓', title: 'Free & Unlimited', desc: 'Convert as many documents as you need with no daily limits, no accounts, and no watermarks.' },
  ],
  contentTitle: 'Document Format Conversion Guide',
  contentSections: [
    { heading: 'Why Convert Document Formats?', text: 'Different software, platforms, and workflows require different document formats. You might need to convert a Word report to PDF for sharing, an Excel spreadsheet to CSV for data import, a PowerPoint presentation to images for social media, or an HTML document to DOCX for editing in Word. Our universal format converter handles all these scenarios and more.' },
    { heading: 'Choosing the Right Format', text: 'PDF for sharing final documents (universal viewing). DOCX for editable text documents. XLSX for spreadsheet data and calculations. PPTX for presentations. CSV for data exchange between systems. HTML for web publishing. TXT for plain text without formatting. ODP/ODS/ODT for open-source office compatibility. Choose based on how the document will be used by its recipient.' },
  ],
  faqs: [
    { q: 'What format combinations are supported?', a: 'We support conversions between all major office document formats including Word, Excel, PowerPoint, PDF, TXT, HTML, CSV, RTF, ODT, ODS, ODP, and more.' },
    { q: 'Will formatting be lost in conversion?', a: 'Formatting is preserved as much as the target format allows. PDF preserves everything. TXT removes all formatting. Other formats preserve formatting to varying degrees.' },
    { q: 'Can I convert multiple files at once?', a: 'Yes! Upload multiple files and convert them all to your chosen target format in one batch operation.' },
    { q: 'Is there a file size limit?', a: 'Individual files can be up to 100 MB. There is no limit on the number of files you can convert.' },
  ],
  relatedTools: [...pick(docToolLinks, '/format-converter', 2), ...pick(pdfToolLinks, '/format-converter', 2)],
};
