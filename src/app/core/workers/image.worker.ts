/// <reference lib="webworker" />
import imageCompression from 'browser-image-compression';

addEventListener('message', async ({ data }) => {
  const { file, targetSizeKB, maxWidthOrHeight, type } = data;
  
  if (!file) return;

  try {
    if (type === 'compress') {
      const options = {
        maxSizeMB: targetSizeKB ? targetSizeKB / 1024 : 1, // Default 1MB if not specified
        maxWidthOrHeight: maxWidthOrHeight || 1920,
        useWebWorker: false, // We are already in a worker
        alwaysKeepResolution: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      postMessage({
        success: true,
        file: compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size
      });
    }
  } catch (error: any) {
    postMessage({
      success: false,
      error: error.message || 'Compression failed'
    });
  }
});
