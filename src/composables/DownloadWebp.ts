import { ref } from "vue";
import JSZip from "jszip";

export function useDownloadWebp() {
  const isDownloading = ref(false);

  // Helper function for the traditional fallback method
  const fallbackDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = file.name; // This attribute explicitly tells the browser to save, not open
    
    // Append, click, and immediately remove the invisible link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Give the browser 100ms to register the download before destroying the file in memory
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const triggerDownload = async (file: File | null) => {
    if (!file) return;
    isDownloading.value = true;

    try {
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: file.name,
          types: [{
            description: 'WebP Image',
            accept: { 'image/webp': ['.webp'] },
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
      } else {
        fallbackDownload(file);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Save failed:", error);
        alert("There was an error saving your file.");
      }
    } finally {
      isDownloading.value = false;
    }
  };

  const triggerMultipleDownloads = async (files: File[]) => {
    if (!files || files.length === 0) return;
    isDownloading.value = true;

    try {
      // 1. Create a new ZIP archive
      const zip = new JSZip();

      // 2. Add each WebP file into the zip
      files.forEach((file) => {
        zip.file(file.name, file);
      });

      // 3. Generate the Zip file blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFile = new File([zipBlob], "converted_images.zip", { type: "application/zip" });

      // 4. Trigger the "Save As" prompt for the ZIP file
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: "converted_images.zip",
          types: [{
            description: 'ZIP Archive',
            accept: { 'application/zip': ['.zip'] },
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(zipFile);
        await writable.close();
        
        console.log("Zip file saved successfully!");
      } else {
        // Fallback for older browsers (will just download the zip directly)
        fallbackDownload(zipFile);
        console.log("Fallback zip download triggered.");
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Zip save failed:", error);
        alert("There was an error saving your zip file.");
      }
    } finally {
      isDownloading.value = false;
    }
  };

  return {
    isDownloading,
    triggerDownload,
    triggerMultipleDownloads
  };
}