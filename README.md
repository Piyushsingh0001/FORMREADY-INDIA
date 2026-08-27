# FORMREADY INDIA

**"Prepare your photo, signature & documents for online forms."**

FormReady India is a privacy-first, production-ready utility website designed specifically for Indian users applying for government jobs, exams, visas, and colleges online. It provides a suite of completely client-side, hyper-fast image and PDF manipulation tools that don't require any technical knowledge or Photoshop skills.

## Features

- **Photo Resizer & Compressor:** Crop your image and flawlessly compress it to strict KB limits without losing noticeable quality.
- **Signature Resizer:** Automatically detects and removes unnecessary whitespace from handwritten signatures (even on poorly-lit photos) before compressing to a target KB.
- **Passport Photo Maker:** Instantly generates mathematically accurate A4 layouts for standard 3.5x4.5cm passport photos.
- **Image to PDF Converter:** Converts multiple images into A4 or US Letter PDF documents with drag-and-drop reordering and rotation.
- **PDF Compressor:** Simple tool to reduce the size of generated documents.
- **100% Privacy Focused:** Files are processed securely inside your own web browser using Web Workers and WebAssembly. No files are ever sent to an external server.

## Tech Stack

- **Framework:** Angular 19 (Standalone)
- **Styling:** Angular Material (M3), custom SCSS, fully responsive design
- **Core Libraries:**
  - `browser-image-compression` (Web Worker optimized)
  - `pdf-lib` (Client-side PDF generation)
  - `ngx-image-cropper`
  - `@angular/cdk` (Drag and Drop)

## Getting Started

To run the project locally on your machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run start
   ```
   Navigate to `http://localhost:4200/`.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   The build artifacts will be stored in the `dist/` directory.

## Architecture & Performance

FormReady India acts as a "thick client". To guarantee a fluid UX on low-end mobile devices without compromising user privacy:
- Heavy image processing is strictly offloaded to a background `Worker` thread.
- A built-in `preScaleImage` interceptor dynamically prevents large 15MB+ camera uploads from triggering Out-Of-Memory (OOM) browser crashes before they ever hit the compression algorithms.
- Heavy libraries (`pdf-lib`, `browser-image-compression`) are lazy-loaded on demand to ensure an initial JavaScript payload of `< 100KB` (gzipped).

## Credits
Made by Piyush Singh
