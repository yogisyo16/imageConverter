<script setup lang="ts">
import { ref } from "vue";
import UploadMultipleImages from "../components/UploadMultipleImages.vue";
import type { PreviewImage } from "../components/UploadMultipleImages.vue";
import { useImageConverter } from "../composables/ComposeUpload";
import { useDownloadWebp } from "../composables/DownloadWebp";

const { convertToWebP, isProcessing } = useImageConverter();
const { isDownloading, triggerMultipleDownloads } = useDownloadWebp();

const previewImages = ref<PreviewImage[]>([]);
const convertedFiles = ref<File[]>([]);

const handleImagesConversion = async (files: File[]) => {
    // Clear previous batch if new ones are selected
    clearImages();

    // Process files one by one to avoid freezing the browser on heavy HEIC conversions
    for (const file of files) {
        try {
            const webpBlob = await convertToWebP(file);
            const webpFile = new File(
                [webpBlob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                { type: "image/webp" },
            );
            
            convertedFiles.value.push(webpFile);
            previewImages.value.push({
                url: URL.createObjectURL(webpFile),
                name: webpFile.name
            });
        } catch (error) {
            console.error(`Failed to convert ${file.name}:`, error);
        }
    }
};

const onDownloadAllRequested = () => {
    triggerMultipleDownloads(convertedFiles.value);
};

const clearImages = () => {
    previewImages.value.forEach(img => URL.revokeObjectURL(img.url));
    previewImages.value = [];
    convertedFiles.value = [];
};
</script>

<template>
    <UploadMultipleImages
        :images="previewImages"
        :is-processing="isProcessing"
        :is-processing-download="isDownloading"
        :download-all-webp="onDownloadAllRequested"
        @files-selected="handleImagesConversion"
        @delete-images="clearImages"
    />
</template>