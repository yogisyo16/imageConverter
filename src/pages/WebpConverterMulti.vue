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
import type { CompressionLevel } from "../composables/ComposeUpload";

const handleImagesConversion = async (files: File[], level: CompressionLevel) => {
    clearImages();

    for (const file of files) {
        try {
            // Pass the level in here
            const webpBlob = await convertToWebP(file, level);
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