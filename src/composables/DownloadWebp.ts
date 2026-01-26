import { ref } from "vue";

export function useDownloadWebp() {
  const isDownloading = ref(false);

  const triggerDownload = (file: File | null) => {
    if (!file) return;

    isDownloading.value = true;

    // Create a temporary link element
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = file.name; // Uses the filename we generated earlier

    setTimeout(() => {
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      isDownloading.value = false;
      console.log("Download triggered for:", file.name);
    }, 1000);
  };

  return {
    isDownloading,
    triggerDownload,
  };
}
