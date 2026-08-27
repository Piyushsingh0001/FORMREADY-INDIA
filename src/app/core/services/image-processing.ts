import { Injectable } from '@angular/core';

export interface CompressOptions {
  targetSizeKB?: number;
  maxWidthOrHeight?: number;
}

export interface CompressResult {
  file: File;
  originalSize: number;
  compressedSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {
  private worker: Worker | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../workers/image.worker', import.meta.url), { type: 'module' });
    } else {
      console.warn('Web Workers are not supported in this environment.');
    }
  }

  compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        // Fallback or error if Web Worker is unsupported
        // For MVP, we assume modern browser with Worker support
        reject(new Error('Web Workers not supported.'));
        return;
      }

      const messageHandler = ({ data }: MessageEvent) => {
        this.worker!.removeEventListener('message', messageHandler);
        this.worker!.removeEventListener('error', errorHandler);
        
        if (data.success) {
          resolve({
            file: data.file,
            originalSize: data.originalSize,
            compressedSize: data.compressedSize
          });
        } else {
          reject(new Error(data.error));
        }
      };

      const errorHandler = (error: ErrorEvent) => {
        this.worker!.removeEventListener('message', messageHandler);
        this.worker!.removeEventListener('error', errorHandler);
        reject(new Error('Worker error: ' + error.message));
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.addEventListener('error', errorHandler);

      this.worker.postMessage({
        type: 'compress',
        file,
        targetSizeKB: options.targetSizeKB,
        maxWidthOrHeight: options.maxWidthOrHeight
      });
    });
  }

  async preScaleImage(file: File, maxDimension = 4000): Promise<File> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension) {
          resolve(file); // No scaling needed
          return;
        }

        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(new File([blob], file.name, { type: file.type || 'image/jpeg' }));
        }, file.type || 'image/jpeg', 0.95);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file); // Fallback
      };
      img.src = url;
    });
  }

  async autoCropSignature(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        let hasContent = false;
        
        // 1. Sample corners to find dominant background color
        let bgR = 255, bgG = 255, bgB = 255;
        let samples = 0;
        let sumR = 0, sumG = 0, sumB = 0;
        
        const sampleSize = Math.min(10, Math.floor(Math.min(canvas.width, canvas.height) * 0.05));
        const corners = [
          {x: 0, y: 0},
          {x: canvas.width - sampleSize, y: 0},
          {x: 0, y: canvas.height - sampleSize},
          {x: canvas.width - sampleSize, y: canvas.height - sampleSize}
        ];
        
        for (const c of corners) {
          for (let sy = 0; sy < sampleSize; sy++) {
            for (let sx = 0; sx < sampleSize; sx++) {
              const idx = ((c.y + sy) * canvas.width + (c.x + sx)) * 4;
              // Only include opaque pixels in background sample
              if (data[idx+3] > 200) {
                sumR += data[idx];
                sumG += data[idx+1];
                sumB += data[idx+2];
                samples++;
              }
            }
          }
        }
        
        if (samples > 0) {
          bgR = sumR / samples;
          bgG = sumG / samples;
          bgB = sumB / samples;
        }

        const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
          return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
        };
        
        // Threshold for distance. e.g. 50 is a reasonable tolerance for slight lighting variations.
        const tolerance = 45; 
        
        const isBackground = (r: number, g: number, b: number, a: number) => {
          if (a < 10) return true; // Transparent
          
          const dist = colorDistance(r, g, b, bgR, bgG, bgB);
          return dist < tolerance;
        };

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            if (!isBackground(data[index], data[index+1], data[index+2], data[index+3])) {
              hasContent = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!hasContent) {
          reject(new Error("Couldn't automatically detect the signature. Please use manual crop."));
          return;
        }
        
        // Add a small padding (e.g. 5%)
        const paddingX = Math.max(10, Math.floor((maxX - minX) * 0.05));
        const paddingY = Math.max(10, Math.floor((maxY - minY) * 0.05));
        
        minX = Math.max(0, minX - paddingX);
        minY = Math.max(0, minY - paddingY);
        maxX = Math.min(canvas.width, maxX + paddingX);
        maxY = Math.min(canvas.height, maxY + paddingY);
        
        const croppedWidth = maxX - minX;
        const croppedHeight = maxY - minY;

        if (croppedWidth === canvas.width && croppedHeight === canvas.height) {
            resolve(file); // No crop needed
            return;
        }

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = croppedWidth;
        croppedCanvas.height = croppedHeight;
        const croppedCtx = croppedCanvas.getContext('2d');
        if (!croppedCtx) {
          resolve(file);
          return;
        }

        croppedCtx.fillStyle = '#ffffff';
        croppedCtx.fillRect(0, 0, croppedWidth, croppedHeight);
        croppedCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

        croppedCanvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(new File([blob], file.name, { type: file.type || 'image/jpeg' }));
        }, file.type || 'image/jpeg', 1.0);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file); // Fallback
      };
      img.src = url;
    });
  }
}
