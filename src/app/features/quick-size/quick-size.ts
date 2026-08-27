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

@Component({
  selector: 'app-quick-size',
  standalone: true,
  imports: [
    CommonModule, 
    FileUpload, 
    MatCardModule, 
    MatButtonModule, 
    MatButtonToggleModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    FormsModule
  ],
  templateUrl: './quick-size.html',
  styleUrl: './quick-size.scss'
})
export class QuickSize {
  private imageService = inject(ImageProcessingService);

  selectedFile = signal<File | null>(null);
  compressedResult = signal<CompressResult | null>(null);
  
  isProcessing = signal(false);
  errorMessage = signal('');
  
  targetKb = signal<number>(100);
  customKb = signal<number | null>(null);

  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.compressedResult.set(null);
    this.errorMessage.set('');
  }

  onError(msg: string) {
    this.errorMessage.set(msg);
  }

  async processImage() {
    const file = this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const targetSize = this.customKb() || this.targetKb();
      
      const result = await this.imageService.compressImage(file, {
        targetSizeKB: targetSize
      });
      this.compressedResult.set(result);
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
    this.compressedResult.set(null);
    this.errorMessage.set('');
  }
}
