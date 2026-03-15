import { ref } from "vue";
import heic2any from "heic2any";

export function useImageConverter() {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  // Changed default quality to 0.75 for better WebP efficiency
  const convertToWebP = async (file: File, quality = 0.75): Promise<Blob> => {
    isProcessing.value = true;
    error.value = null;

    try {
      let processBlob: Blob = file;
      const isHeic = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

      if (isHeic) {
        // So this is using heic2any library, to convert it into jpeg with 100% quality
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 1.0, 
        });
        
        if (Array.isArray(converted)) {
          if (!converted[0]) throw new Error("HEIC conversion failed: No image data returned.");
          processBlob = converted[0];
        } else {
          processBlob = converted;
        }
      }

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(processBlob);

        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;

          img.onload = () => {
            // Smart Resizing: Cap max width to 2500px to save massive amounts of data
            const MAX_WIDTH = 2500;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            // Draw the image with the new scaled dimensions
            ctx.drawImage(img, 0, 0, width, height);
            
            // Output of the conversion into webp extension
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Serialization failed"));
                }
              },
              "image/webp",
              quality,
            );
          };

          img.onerror = () => reject(new Error("Image loading failed"));
        };

        reader.onerror = () => reject(new Error("File reading failed"));
      });
    } catch (err: any) {
      error.value = err.message || "An error occurred during conversion";
      throw err;
    } finally {
      isProcessing.value = false;
    }
  };

  return { convertToWebP, isProcessing, error };
}