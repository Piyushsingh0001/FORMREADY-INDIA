import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { DragDrop } from '../../directives/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [DragDrop, MatIconModule, MatButtonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss'
})
export class FileUpload {
  @Input() acceptedTypes: string = 'image/jpeg, image/png, image/webp';
  @Input() title: string = 'Drag & Drop your file here';
  @Input() subtitle: string = 'or click to browse';
  @Input() multiple: boolean = false;
  
  @Output() fileSelected = new EventEmitter<File>();
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() error = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onFileDropped(files: File | File[]) {
    if (Array.isArray(files)) {
      this.handleFiles(files);
    } else {
      this.handleFiles([files]);
    }
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.handleFiles(Array.from(fileList));
    }
  }

  browseFiles() {
    this.fileInput.nativeElement.click();
  }

  private handleFiles(files: File[]) {
    // Basic validation based on accepted types
    if (this.acceptedTypes && this.acceptedTypes !== '*') {
      const types = this.acceptedTypes.split(',').map(t => t.trim());
      const isValid = files.every(file => types.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      }));
      
      if (!isValid) {
        this.error.emit(`Unsupported file type. Please upload: ${this.acceptedTypes}`);
        return;
      }
    }
    
    if (this.multiple) {
      this.filesSelected.emit(files);
    } else {
      this.fileSelected.emit(files[0]);
    }
    
    // Reset input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
