<script setup lang="ts">
import { ref } from "vue";
import UploadImage from "../components/UploadImage.vue";
import { useImageConverter } from "../composables/ComposeUpload";
import { useDownloadWebp } from "../composables/DownloadWebp";

const { convertToWebP, isProcessing } = useImageConverter();
const { isDownloading, triggerDownload } = useDownloadWebp();
const previewUrl = ref<string | null>(null);
const convertedFile = ref<File | null>(null);
import type { CompressionLevel } from "../composables/ComposeUpload"; // Import the type

// Update the function signature to receive the level
const handleImageConversion = async (file: File, level: CompressionLevel) => {
    // Pass the level into your composable
    const webpBlob = await convertToWebP(file, level); 
    
    const webpFile = new File(
        [webpBlob],
        file.name.replace(/\.[^/.]+$/, "") + ".webp",
        { type: "image/webp" },
    );
    convertedFile.value = webpFile;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(webpFile);
};

const onDownloadRequested = () => triggerDownload(convertedFile.value);
const clearImage = () => {
    previewUrl.value = null;
    convertedFile.value = null;
};
</script>

<template>
    <UploadImage
        :image="previewUrl"
        :is-processing="isProcessing"
        :is-processing-download="isDownloading"
        :download-webp="onDownloadRequested"
        @file-selected="handleImageConversion"
        @delete-image="clearImage"
    />
</template>
