<script setup lang="ts">
import { ref } from "vue";

export interface UploadImageProps {
    image: string | null;
    isProcessing?: boolean;
    downloadWebp?: () => void;
    isProcessingDownload?: boolean;
}

const props = defineProps<UploadImageProps>();

// Define the event to send the file back to App.vue
const emit = defineEmits<{
    (e: "file-selected", file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a JPG or PNG!");

            input.value = "";
            return;
        }
        emit("file-selected", file);
    }
};
</script>

<template>
    <div
        class="flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-xl shadow-lg"
    >
        <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept=".jpg, .jpeg, .png, image/jpeg, image/png"
            @change="onFileChange"
        />

        <p class="font-bold text-white">Image Converter to Webp</p>

        <button
            class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full drop-shadow-md drop-shadow-black hover:drop-shadow-lg transition-colors disabled:bg-blue-300"
            :disabled="isProcessing"
            @click="triggerFileInput"
        >
            {{ isProcessing ? "Converting..." : "Select New Image" }}
        </button>

        <div v-if="image" class="mt-4 flex flex-col items-center">
            <p class="text-sm text-white mb-2 italic">WebP Preview:</p>
            <img
                :src="image"
                alt="Uploaded Image"
                class="max-w-xs rounded-lg shadow-2xl border-4 border-white"
            />
        </div>
        <button
            class="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-6 rounded-full drop-shadow-md drop-shadow-black hover:drop-shadow-lg transition-colors disabled:bg-gray-600 disabled:drop-shadow-none"
            :disabled="isProcessingDownload || !image"
            @click="downloadWebp"
        >
            {{ isProcessingDownload ? "Downloading..." : "Download WebP" }}
        </button>
    </div>
</template>
