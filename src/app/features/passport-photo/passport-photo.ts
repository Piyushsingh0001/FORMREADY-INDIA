import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../shared/components/file-upload/file-upload';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-passport-photo',
  standalone: true,
  imports: [CommonModule, FileUpload, MatCardModule, MatButtonModule, MatIconModule, FormsModule, MatSelectModule],
  templateUrl: './passport-photo.html',
  styleUrl: './passport-photo.scss'
})
export class PassportPhoto {
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  
  isProcessing = signal(false);
  errorMessage = signal('');
  
  preset = signal<string>('3.5x4.5'); // Default: 3.5 x 4.5 cm
  
  // A4 at 300 DPI
  private readonly A4_WIDTH = 2480;
  private readonly A4_HEIGHT = 3508;

  onFileSelected(file: File) {
    this.selectedFile.set(file);
    const url = URL.createObjectURL(file);
    this.previewUrl.set(url);
    this.errorMessage.set('');
  }

  onError(msg: string) {
    this.errorMessage.set(msg);
  }

  reset() {
    this.selectedFile.set(null);
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
      this.previewUrl.set(null);
    }
    this.errorMessage.set('');
  }

  async generateA4Sheet() {
    const url = this.previewUrl();
    if (!url) return;

    this.isProcessing.set(true);
    
    try {
      const img = new Image();
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = this.A4_WIDTH;
      canvas.height = this.A4_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, this.A4_WIDTH, this.A4_HEIGHT);

      // Determine passport photo size in pixels (300 DPI)
      // 3.5cm = 1.37 inches -> ~413 pixels
      // 4.5cm = 1.77 inches -> ~531 pixels
      let photoWidth = 413;
      let photoHeight = 531;

      if (this.preset() === '2x2') {
        photoWidth = 600; // 2 inches = 600px
        photoHeight = 600;
      } else if (this.preset() === '3.5x4.5') {
        photoWidth = 413;
        photoHeight = 531;
      }

      const marginX = 100;
      const marginY = 100;
      const gapX = 40;
      const gapY = 40;

      const cols = Math.floor((this.A4_WIDTH - 2 * marginX) / (photoWidth + gapX));
      const rows = Math.floor((this.A4_HEIGHT - 2 * marginY) / (photoHeight + gapY));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginX + c * (photoWidth + gapX);
          const y = marginY + r * (photoHeight + gapY);
          
          // Draw border
          ctx.strokeStyle = '#cccccc';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, photoWidth, photoHeight);
          
          // Calculate object-fit: cover math
          const srcRatio = img.width / img.height;
          const dstRatio = photoWidth / photoHeight;
          
          let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
          
          if (srcRatio > dstRatio) {
            // Source is wider than dest
            sWidth = img.height * dstRatio;
            sx = (img.width - sWidth) / 2;
          } else {
            // Source is taller than dest
            sHeight = img.width / dstRatio;
            sy = (img.height - sHeight) / 2;
          }

          // Draw cropped image
          ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight);
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          this.errorMessage.set('Failed to generate sheet');
          this.isProcessing.set(false);
          return;
        }
        
        const outUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = outUrl;
        a.download = 'formready_a4_passport_sheet.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(outUrl);
        
        this.isProcessing.set(false);
      }, 'image/jpeg', 0.95);

    } catch (e) {
      this.errorMessage.set('Failed to process image');
      this.isProcessing.set(false);
    }
  }
}
