import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home), title: 'FormReady India - Prepare your documents' },
  { path: 'photo-resizer', loadComponent: () => import('./features/photo-resizer/photo-resizer').then(m => m.PhotoResizer), title: 'Photo Resizer & Compressor | FormReady India' },
  { path: 'signature-resizer', loadComponent: () => import('./features/signature-resizer/signature-resizer').then(m => m.SignatureResizer), title: 'Signature Resizer | FormReady India' },
  { path: 'quick-size', loadComponent: () => import('./features/quick-size/quick-size').then(m => m.QuickSize), title: 'Quick File Size Tool | FormReady India' },
  { path: 'passport-photo', loadComponent: () => import('./features/passport-photo/passport-photo').then(m => m.PassportPhoto), title: 'Passport Photo Maker | FormReady India' },
  { path: 'image-to-pdf', loadComponent: () => import('./features/image-to-pdf/image-to-pdf').then(m => m.ImageToPdf), title: 'Image to PDF Converter | FormReady India' },
  { path: 'pdf-compressor', loadComponent: () => import('./features/pdf-compressor/pdf-compressor').then(m => m.PdfCompressor), title: 'PDF Compressor | FormReady India' },
  { path: 'privacy', loadComponent: () => import('./features/legal/legal').then(m => m.Legal), title: 'Privacy Policy | FormReady India' },
  { path: 'terms', loadComponent: () => import('./features/legal/legal').then(m => m.Legal), title: 'Terms of Use | FormReady India' },
  { path: 'about', loadComponent: () => import('./features/legal/legal').then(m => m.Legal), title: 'About | FormReady India' },
  { path: '**', redirectTo: '' }
];
