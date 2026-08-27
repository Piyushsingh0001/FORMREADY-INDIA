import { Component, inject, signal } from '@angular/core';
import { FileUpload } from '../../shared/components/file-upload/file-upload';
import { ImageProcessingService, CompressResult } from '../../core/services/image-processing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-resizer',
  standalone: true,
  imports: [
    CommonModule, 
    FileUpload, 
    MatCardModule, 
    MatButtonModule, 
    MatButtonToggleModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    FormsModule,
    ImageCropperComponent
  ],
  templateUrl: './photo-resizer.html',
  styleUrl: './photo-resizer.scss'
})
export class PhotoResizer {
  private imageService = inject(ImageProcessingService);

  selectedFile = signal<File | null>(null);
  croppedFile = signal<File | null>(null);
  isCropping = signal(false);
  compressedResult = signal<CompressResult | null>(null);
  targetFailed = signal(false);
  
  isProcessing = signal(false);
  errorMessage = signal('');
  
  targetKb = signal<number>(50);
  customKb = signal<number | null>(null);

  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.isCropping.set(true);
    this.croppedFile.set(null);
    this.compressedResult.set(null);
    this.targetFailed.set(false);
    this.errorMessage.set('');
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const file = new File([event.blob], this.selectedFile()?.name || 'cropped.jpg', { type: 'image/jpeg' });
      this.croppedFile.set(file);
    }
  }

  confirmCrop() {
    this.isCropping.set(false);
  }

  onError(msg: string) {
    this.errorMessage.set(msg);
  }

  async processImage() {
    const file = this.croppedFile() || this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      // Pre-scale if large to avoid worker crash
      const safeFile = await this.imageService.preScaleImage(file);
      
      const targetSize = this.customKb() || this.targetKb();
      
      const result = await this.imageService.compressImage(safeFile, {
        targetSizeKB: targetSize
      });
      this.compressedResult.set(result);
      
      // If output size is > 5% larger than target size, flag as failed target
      if (result.compressedSize > (targetSize * 1024 * 1.05)) {
        this.targetFailed.set(true);
      } else {
        this.targetFailed.set(false);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to process image');
    } finally {
      this.isProcessing.set(false);
    }
  }

  downloadResult() {
    const result = this.compressedResult();
    if (!result) return;
    
    const url = URL.createObjectURL(result.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formready_${result.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  reset() {
    this.selectedFile.set(null);
    this.croppedFile.set(null);
    this.isCropping.set(false);
    this.compressedResult.set(null);
    this.targetFailed.set(false);
    this.errorMessage.set('');
  }
}
