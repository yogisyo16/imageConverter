<script setup lang="ts">
import { ref } from "vue";
import UploadImage from "./components/UploadImage.vue";
import AdComponent from "./components/AddComponent.vue";
import { useImageConverter } from "./composables/ComposeUpload";
import { useDownloadWebp } from "./composables/DownloadWebp";

const { convertToWebP, isProcessing } = useImageConverter();
const { isDownloading, triggerDownload } = useDownloadWebp();
const previewUrl = ref<string | null>(null);
const convertedFile = ref<File | null>(null);

const handleImageConversion = async (file: File) => {
    try {
        const webpBlob = await convertToWebP(file);

        // Convert Blob to a File object (useful if you're sending to an API later)
        const webpFile = new File(
            [webpBlob],
            file.name.replace(/\.[^/.]+$/, "") + ".webp",
            { type: "image/webp" },
        );

        convertedFile.value = webpFile;

        // Clean up old memory if a preview already exists
        if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);

        // Create a local URL for the <img> tag
        previewUrl.value = URL.createObjectURL(webpFile);

        console.log("Success! Final WebP File:", webpFile);
    } catch (err) {
        console.error("Conversion failed:", err);
    }
};

const isProcessingDownload = ref(false);

const onDownloadRequested = () => {
    triggerDownload(convertedFile.value);
};
</script>

<template>
    <div
        class="flex flex-col min-w-auto min-h-screen justify-center items-center gap-2 bg-gray-600"
    >
        <UploadImage
            :image="previewUrl"
            :is-processing="isProcessing"
            :is-processing-download="isDownloading"
            :download-webp="onDownloadRequested"
            @file-selected="handleImageConversion"
        />
    </div>
    <footer class="p-4 bg-gray-800">
        <AdComponent />
    </footer>
</template>

<style scoped></style>
