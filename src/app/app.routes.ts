import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home').then(m => m.Home), 
    title: 'Free Online Form & Document Tools | FormReady India',
    data: { 
      description: 'Free tools to resize photos, compress signatures, create passport photos and convert images to PDF. Your files are processed locally in your browser.',
      canonical: 'https://formready-india.vercel.app/'
    }
  },
  { 
    path: 'photo-resizer', 
    loadComponent: () => import('./features/photo-resizer/photo-resizer').then(m => m.PhotoResizer), 
    title: 'Photo Resizer & Compressor Online | FormReady India',
    data: { 
      description: 'Resize and compress photos to your required dimensions and KB size. Crop and download your image directly in your browser.',
      canonical: 'https://formready-india.vercel.app/photo-resizer'
    }
  },
  { 
    path: 'signature-resizer', 
    loadComponent: () => import('./features/signature-resizer/signature-resizer').then(m => m.SignatureResizer), 
    title: 'Signature Resizer & Compressor | FormReady India',
    data: { 
      description: 'Resize, crop and compress signature images for online forms while keeping your files private and processed locally.',
      canonical: 'https://formready-india.vercel.app/signature-resizer'
    }
  },
  { 
    path: 'quick-size', 
    loadComponent: () => import('./features/quick-size/quick-size').then(m => m.QuickSize), 
    title: 'Quick File Size Tool | FormReady India',
    data: { 
      description: 'Quickly check and adjust file sizes for your images before uploading to online portals.',
      canonical: 'https://formready-india.vercel.app/quick-size'
    }
  },
  { 
    path: 'passport-photo', 
    loadComponent: () => import('./features/passport-photo/passport-photo').then(m => m.PassportPhoto), 
    title: 'Passport Photo Maker Online | FormReady India',
    data: { 
      description: 'Create passport-size photos and print multiple copies on an A4 sheet. Crop and prepare your photo directly in your browser.',
      canonical: 'https://formready-india.vercel.app/passport-photo'
    }
  },
  { 
    path: 'image-to-pdf', 
    loadComponent: () => import('./features/image-to-pdf/image-to-pdf').then(m => m.ImageToPdf), 
    title: 'JPG to PDF Converter Online | FormReady India',
    data: { 
      description: 'Convert JPG and other images to PDF. Reorder, rotate and create A4, Letter or original-size PDF documents directly in your browser.',
      canonical: 'https://formready-india.vercel.app/image-to-pdf'
    }
  },
  { 
    path: 'pdf-compressor', 
    loadComponent: () => import('./features/pdf-compressor/pdf-compressor').then(m => m.PdfCompressor), 
    title: 'PDF Compressor Online | FormReady India',
    data: { 
      description: 'Compress PDF documents to reduce file size for online form uploads without losing readability.',
      canonical: 'https://formready-india.vercel.app/pdf-compressor'
    }
  },
  { 
    path: 'privacy', 
    loadComponent: () => import('./features/legal/legal').then(m => m.Legal), 
    title: 'Privacy Policy | FormReady India',
    data: { 
      description: 'Read the privacy policy of FormReady India. All our tools are designed to be 100% private with local in-browser processing.',
      canonical: 'https://formready-india.vercel.app/privacy'
    }
  },
  { 
    path: 'terms', 
    loadComponent: () => import('./features/legal/legal').then(m => m.Legal), 
    title: 'Terms of Use | FormReady India',
    data: { 
      description: 'Read the terms of use for FormReady India tools.',
      canonical: 'https://formready-india.vercel.app/terms'
    }
  },
  { 
    path: 'about', 
    loadComponent: () => import('./features/legal/legal').then(m => m.Legal), 
    title: 'About | FormReady India',
    data: { 
      description: 'Learn more about FormReady India and why we built these free utility tools for online forms.',
      canonical: 'https://formready-india.vercel.app/about'
    }
  },
  { 
    path: '**', 
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found | FormReady India',
    data: { 
      description: 'The requested page could not be found.',
      canonical: 'https://formready-india.vercel.app/404'
    }
  }
];
