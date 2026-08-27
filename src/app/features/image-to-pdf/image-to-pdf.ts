import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../shared/components/file-upload/file-upload';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PDFDocument, degrees } from 'pdf-lib';

interface ImageItem {
  file: File;
  url: string;
  rotation: number;
}

@Component({
  selector: 'app-image-to-pdf',
  standalone: true,
  imports: [CommonModule, FileUpload, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DragDropModule, MatSelectModule, FormsModule],
  templateUrl: './image-to-pdf.html',
  styleUrl: './image-to-pdf.scss'
})
export class ImageToPdf {
  images = signal<ImageItem[]>([]);
  isProcessing = signal(false);
  errorMessage = signal('');
  
  pageSize = signal<'A4' | 'Letter' | 'Original'>('A4');
  orientation = signal<'Portrait' | 'Landscape'>('Portrait');

  onFilesSelected(files: File[]) {
    const newItems = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      rotation: 0
    }));
    this.images.set([...this.images(), ...newItems]);
    this.errorMessage.set('');
  }

  drop(event: CdkDragDrop<ImageItem[]>) {
    const current = [...this.images()];
    moveItemInArray(current, event.previousIndex, event.currentIndex);
    this.images.set(current);
  }

  rotateImage(index: number) {
    const current = [...this.images()];
    current[index].rotation = (current[index].rotation + 90) % 360;
    this.images.set(current);
  }

  onError(msg: string) {
    this.errorMessage.set(msg);
  }

  removeImage(index: number) {
    const current = this.images();
    URL.revokeObjectURL(current[index].url);
    const updated = [...current];
    updated.splice(index, 1);
    this.images.set(updated);
  }

  reset() {
    this.images().forEach(img => URL.revokeObjectURL(img.url));
    this.images.set([]);
    this.errorMessage.set('');
  }

  async generatePdf() {
    const imgs = this.images();
    if (imgs.length === 0) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgItem of imgs) {
        const imgBytes = await imgItem.file.arrayBuffer();
        let pdfImage;
        
        // pdf-lib supports JPEG and PNG directly
        if (imgItem.file.type === 'image/jpeg' || imgItem.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imgBytes);
        } else if (imgItem.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imgBytes);
        } else {
          // Skip unsupported formats or convert them first (for MVP, skip)
          throw new Error(`Unsupported format for PDF: ${imgItem.file.type}. Please use JPG or PNG.`);
        }

        let dims = pdfImage.scale(1);
        let imgWidth = dims.width;
        let imgHeight = dims.height;

        // If rotated 90 or 270, swap the visual dimensions of the image
        if (imgItem.rotation === 90 || imgItem.rotation === 270) {
          imgWidth = dims.height;
          imgHeight = dims.width;
        }

        let pageWidth = imgWidth;
        let pageHeight = imgHeight;
        
        const isPortrait = this.orientation() === 'Portrait';

        if (this.pageSize() === 'A4') {
          pageWidth = isPortrait ? 595.28 : 841.89;
          pageHeight = isPortrait ? 841.89 : 595.28;
        } else if (this.pageSize() === 'Letter') {
          pageWidth = isPortrait ? 612 : 792;
          pageHeight = isPortrait ? 792 : 612;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        let targetWidth = imgWidth;
        let targetHeight = imgHeight;

        // Calculate object-fit: contain scaling if not original
        if (this.pageSize() !== 'Original') {
          // Leave a 5% margin
          const marginX = pageWidth * 0.05;
          const marginY = pageHeight * 0.05;
          const availableWidth = pageWidth - marginX * 2;
          const availableHeight = pageHeight - marginY * 2;
          
          const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
          if (scale < 1) {
            targetWidth = imgWidth * scale;
            targetHeight = imgHeight * scale;
          } else {
             // scale > 1 means image is smaller than page. Spec says "Scale the image proportionally so it fits within the page". 
             // Typically we can enlarge it slightly or just leave it. Let's enlarge to fit max size.
             targetWidth = imgWidth * scale;
             targetHeight = imgHeight * scale;
          }
        }
        
        // Calculate center position based on target size
        const centerX = (pageWidth - targetWidth) / 2;
        const centerY = (pageHeight - targetHeight) / 2;

        let x = 0;
        let y = 0;
        
        // The rotation origin in pdf-lib is the bottom-left corner of the drawing box.
        // We must calculate the anchor point based on the UNROTATED original image dimensions 
        // drawn into the target area.
        
        const scaleX = targetWidth / imgWidth;
        const scaleY = targetHeight / imgHeight;
        const drawWidth = dims.width * scaleX;
        const drawHeight = dims.height * scaleY;

        if (imgItem.rotation === 0) {
          x = centerX;
          y = centerY;
        } else if (imgItem.rotation === 90) {
          x = centerX + targetWidth;
          y = centerY;
        } else if (imgItem.rotation === 180) {
          x = centerX + targetWidth;
          y = centerY + targetHeight;
        } else if (imgItem.rotation === 270) {
          x = centerX;
          y = centerY + targetHeight;
        }

        page.drawImage(pdfImage, {
          x: x,
          y: y,
          width: drawWidth,
          height: drawHeight,
          rotate: degrees(imgItem.rotation)
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formready_images.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (e: any) {
      this.errorMessage.set(e.message || 'Failed to generate PDF');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
