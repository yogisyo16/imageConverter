import { ref } from "vue";
import heic2any from "heic2any";

// NEW: Define the available options
export type CompressionLevel = "high" | "balanced" | "extreme";

export function useImageConverter() {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  // NEW: Accept the level parameter
  const convertToWebP = async (file: File, level: CompressionLevel = "balanced"): Promise<Blob> => {
    isProcessing.value = true;
    error.value = null;

    // NEW: Determine settings based on the selected level
    let quality = 0.75;
    let MAX_WIDTH = 2500;

    if (level === "high") {
        quality = 0.95;
        MAX_WIDTH = 4000; // Preserves high resolution
    } else if (level === "extreme") {
        quality = 0.5;
        MAX_WIDTH = 1200; // Aggressively scales down to hit tiny file sizes
    }

    try {
      let processBlob: Blob = file;
      const isHeic = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

      if (isHeic) {
        // If they want extreme compression, we can save some memory by lowering the initial HEIC conversion quality too
        const heicQuality = level === "extreme" ? 0.8 : 1.0;
        
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: heicQuality, 
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
            let width = img.width;
            let height = img.height;

            // Apply our dynamic MAX_WIDTH based on the user's setting
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

            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Serialization failed"));
                }
              },
              "image/webp",
              quality, // Apply dynamic quality
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