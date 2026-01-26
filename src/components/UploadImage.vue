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
    if (input.files && input.files.length > 0) {
        // The "!" tells TS: "I promise this is not null/undefined"
        emit("file-selected", input.files[0]!);
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
            accept="image/*"
            @change="onFileChange"
        />

        <p class="font-bold text-white">Image Optimizer</p>

        <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:bg-blue-300"
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
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:bg-green-300"
            :disabled="isProcessingDownload"
            @click="downloadWebp"
        >
            {{ isProcessingDownload ? "Downloading..." : "Download WebP" }}
        </button>
    </div>
</template>
