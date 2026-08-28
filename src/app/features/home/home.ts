import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface ToolCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  tools: ToolCard[] = [
    {
      title: 'Photo',
      description: 'Resize & compress your photo to exact KB limits',
      icon: 'photo_camera',
      route: '/photo-resizer',
      color: '#4caf50'
    },
    {
      title: 'Signature',
      description: 'Resize and compress your signature',
      icon: 'draw',
      route: '/signature-resizer',
      color: '#2196f3'
    },
    {
      title: 'Passport Photo',
      description: 'Create application-ready photos for printing',
      icon: 'person',
      route: '/passport-photo',
      color: '#9c27b0'
    },
    {
      title: 'Image to PDF',
      description: 'Convert multiple images into a single PDF',
      icon: 'picture_as_pdf',
      route: '/image-to-pdf',
      color: '#f44336'
    },
    {
      title: 'PDF Compressor',
      description: 'Reduce PDF file size quickly',
      icon: 'compress',
      route: '/pdf-compressor',
      color: '#ff9800'
    },
    {
      title: 'File Size Tool',
      description: 'Make your image fit a required KB limit',
      icon: 'sd_storage',
      route: '/quick-size',
      color: '#607d8b'
    }
  ];

  scrollToTools() {
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
