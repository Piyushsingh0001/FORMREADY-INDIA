import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../shared/components/file-upload/file-upload';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-compressor',
  standalone: true,
  imports: [CommonModule, FileUpload, MatCardModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
  templateUrl: './pdf-compressor.html',
  styleUrl: './pdf-compressor.scss'
})
export class PdfCompressor {
  selectedFile = signal<File | null>(null);
  compressionLevel = signal<string>('Medium');
  infoMessage = signal<string>('');
  
  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.infoMessage.set('');
  }

  onError(msg: string) {
    this.infoMessage.set(msg);
  }

  reset() {
    this.selectedFile.set(null);
    this.infoMessage.set('');
  }

  compressPdf() {
    // High-quality PDF compression requires server-side logic (e.g. Ghostscript) to downsample images and remove unused fonts without destroying the document.
    // As per architecture guidelines, we will not fake client-side compression.
    this.infoMessage.set('High-quality PDF Compression requires server-side processing. This feature is currently disabled in the privacy-first MVP and will be available in a future update once a secure backend is deployed.');
  }
}
