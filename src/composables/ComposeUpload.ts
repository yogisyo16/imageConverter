import { ref } from "vue";

export function useImageConverter() {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  const convertToWebP = (file: File, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      isProcessing.value = true;
      error.value = null;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                isProcessing.value = false;
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
  };

  return { convertToWebP, isProcessing, error };
}
