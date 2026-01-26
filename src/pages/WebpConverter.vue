<script setup lang="ts">
import { ref } from "vue";
import UploadImage from "../components/UploadImage.vue";
import { useImageConverter } from "../composables/ComposeUpload";
import { useDownloadWebp } from "../composables/DownloadWebp";

const { convertToWebP, isProcessing } = useImageConverter();
const { isDownloading, triggerDownload } = useDownloadWebp();
const previewUrl = ref<string | null>(null);
const convertedFile = ref<File | null>(null);

const handleImageConversion = async (file: File) => {
    const webpBlob = await convertToWebP(file);
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
