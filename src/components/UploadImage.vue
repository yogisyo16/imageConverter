<script setup lang="ts">
import { ref } from "vue";

export interface UploadImageProps {
    image: string | null;
    isProcessing?: boolean;
    downloadWebp?: () => void;
    isProcessingDownload?: boolean;
}

const props = defineProps<UploadImageProps>();

const emit = defineEmits<{
    (e: "file-selected", file: File): void;
    (e: "delete-image"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const showModal = ref(false); // NEW: State to control the modal

const triggerFileInput = () => {
    fileInput.value?.click();
};

const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
        const isHeicExt = file.name.toLowerCase().endsWith(".heic");

        if (!allowedTypes.includes(file.type) && !isHeicExt) {
            alert("Please upload a JPG, PNG, or HEIC!");
            input.value = "";
            return;
        }
        emit("file-selected", file);
    }
};
</script>

<template>
    <div class="flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-xl shadow-lg">
        <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept=".jpg, .jpeg, .png, .heic, image/jpg, image/jpeg, image/png, image/heic"
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
            <p class="text-sm text-white mb-2 italic">WebP Preview (Click to Preview):</p>
            <img
                :src="image"
                alt="Uploaded Image"
                class="max-w-xs rounded-lg shadow-2xl border-4 border-white cursor-pointer hover:opacity-90 transition-opacity"
                @click="showModal = true"
            />
        </div>
        
        <button
            class="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-6 rounded-full drop-shadow-md drop-shadow-black hover:drop-shadow-lg transition-colors disabled:bg-gray-600 disabled:drop-shadow-none disabled:text-gray-400"
            :disabled="isProcessingDownload || !image"
            @click="downloadWebp"
        >
            {{ isProcessingDownload ? "Downloading..." : "Download WebP" }}
        </button>
        <button
            v-if="image"
            @click="$emit('delete-image')"
            class="bg-rose-900 hover:bg-rose-800 text-white font-bold py-2 px-6 rounded-full"
        >
            Delete Image
        </button>

        <Teleport to="body">
            <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div 
                    v-if="showModal && image" 
                    class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    @click="showModal = false"
                >
                    <div class="relative max-w-full max-h-full flex items-center justify-center">
                        <img 
                            :src="image" 
                            class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                            @click.stop 
                        />
                        <button 
                            class="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 bg-gray-900/50 rounded-full p-2"
                            @click="showModal = false"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </transition>
        </Teleport>
    </div>
</template>