import { toast } from 'sonner';
import JSZip from 'jszip';
import type { GalleryPhoto } from '@/actions/gallery/get-gallery-photos-action';

export interface DownloadResult {
  blob: Blob;
  filename: string;
}

/**
 * Download a single photo and return blob with filename
 */
export async function downloadPhotoAsBlob(photo: GalleryPhoto): Promise<DownloadResult> {
  try {
    const photoMetadata = photo.metadata ? JSON.parse(photo.metadata) : {};
    const downloadUrl = photoMetadata.downloadUrl || photo.fileUrl;
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download ${photo.id}: ${response.status}`);
    }
    
    const blob = await response.blob();
    const originalName = photoMetadata.originalName || photoMetadata.filename || `photo-${photo.id}`;
    const fileExtension = originalName.split('.').pop() || 'jpg';
    const filename = originalName.includes('.') ? originalName : `${originalName}.${fileExtension}`;
    
    return { blob, filename };
  } catch (error) {
    console.error(`Error downloading photo ${photo.id}:`, error);
    throw error;
  }
}

/**
 * Get filename for a photo from metadata
 */
export function getPhotoFilename(photo: GalleryPhoto): string {
  const photoMetadata = photo.metadata ? JSON.parse(photo.metadata) : {};
  const originalName = photoMetadata.originalName || photoMetadata.filename || `photo-${photo.id}`;
  const fileExtension = originalName.split('.').pop() || 'jpg';
  return originalName.includes('.') ? originalName : `${originalName}.${fileExtension}`;
}

/**
 * Download a single photo directly using Vercel Blob's download URL or fallback method
 */
export async function downloadSinglePhoto(photo: GalleryPhoto): Promise<void> {
  try {
    const photoMetadata = photo.metadata ? JSON.parse(photo.metadata) : {};
    const downloadUrl = photoMetadata.downloadUrl || photo.fileUrl;
    const fileName = getPhotoFilename(photo);
    
    // For Vercel Blob URLs, use direct link approach for better performance
    if (photoMetadata.downloadUrl) {
      // Use Vercel Blob's built-in download URL with proper headers
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Téléchargement de ${fileName} démarré`);
    } else {
      // Fallback: Fetch and download for non-blob URLs
      const response = await fetch(photo.fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
      
      toast.success(`Téléchargement de ${fileName} terminé`);
    }
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Erreur lors du téléchargement de la photo');
    throw error;
  }
}

/**
 * Generate ZIP filename based on selected photos
 */
export function generateZipFilename(photos: GalleryPhoto[]): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const projectNames = [...new Set(photos.map(p => p.missionProject.project.title))];
  
  return projectNames.length === 1 
    ? `${projectNames[0].replace(/[^a-zA-Z0-9-_]/g, '_')}_${timestamp}.zip`
    : `Photos_DGMP_${timestamp}.zip`;
}

/**
 * Estimate ZIP file size based on photo metadata
 */
export function estimateZipSize(photos: GalleryPhoto[]): string {
  if (photos.length === 0) return '';
  
  const totalSize = photos.reduce((sum, photo) => {
    const metadata = photo.metadata ? JSON.parse(photo.metadata) : {};
    return sum + (metadata.size || 2000000); // Fallback to ~2MB if no size info
  }, 0);
  
  // Estimate compression (JPEG photos typically compress to ~70-80% in ZIP)
  const estimatedZipSize = totalSize * 0.75;
  
  if (estimatedZipSize > 1024 * 1024 * 1024) {
    return `~${(estimatedZipSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  } else if (estimatedZipSize > 1024 * 1024) {
    return `~${(estimatedZipSize / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `~${Math.round(estimatedZipSize / 1024)} KB`;
  }
}

export interface BulkDownloadOptions {
  onProgress?: (current: number, total: number) => void;
  batchSize?: number;
}

/**
 * Download multiple photos as a ZIP file
 */
export async function downloadPhotosAsZip(
  photos: GalleryPhoto[], 
  options: BulkDownloadOptions = {}
): Promise<void> {
  const { onProgress, batchSize = 5 } = options;
  
  if (photos.length === 0) {
    throw new Error('No photos to download');
  }

  try {
    onProgress?.(0, photos.length);
    toast.info(`Préparation du téléchargement de ${photos.length} photo(s)...`);

    const zip = new JSZip();
    let completedCount = 0;
    
    // Download photos in batches to avoid overwhelming the browser
    for (let i = 0; i < photos.length; i += batchSize) {
      const batch = photos.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (photo) => {
          try {
            const { blob, filename } = await downloadPhotoAsBlob(photo);
            
            // Add project and mission info to organize files in ZIP
            const projectName = photo.missionProject.project.title.replace(/[^a-zA-Z0-9-_]/g, '_');
            const missionNumber = photo.missionProject.mission.missionNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
            const folderPath = `${projectName}/${missionNumber}`;
            
            zip.file(`${folderPath}/${filename}`, blob);
            
            completedCount++;
            onProgress?.(completedCount, photos.length);
          } catch (error) {
            console.error(`Failed to download photo ${photo.id}:`, error);
            // Continue with other photos even if one fails
          }
        })
      );
    }

    if (completedCount === 0) {
      throw new Error('Aucune photo n\'a pu être téléchargée');
    }

    // Generate ZIP file
    toast.info('Génération du fichier ZIP...');
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Create download link
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateZipFilename(photos);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    
    toast.success(`${completedCount} photo(s) téléchargée(s) avec succès dans ${generateZipFilename(photos)}`);
    
  } catch (error) {
    console.error('Bulk download error:', error);
    toast.error('Erreur lors du téléchargement groupé');
    throw error;
  }
}
