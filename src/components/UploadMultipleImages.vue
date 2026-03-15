<script setup lang="ts">
import { ref, computed } from "vue";

export interface PreviewImage {
    url: string;
    name: string;
}

export interface UploadMultipleImagesProps {
    images: PreviewImage[];
    isProcessing?: boolean;
    downloadAllWebp?: () => void;
    isProcessingDownload?: boolean;
}

const props = defineProps<UploadMultipleImagesProps>();

const emit = defineEmits<{
    (e: "files-selected", files: File[]): void;
    (e: "delete-images"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedIndex = ref<number | null>(null);

// FIXED: Using optional chaining (?.) to satisfy TypeScript
const currentPreviewUrl = computed(() => {
    if (selectedIndex.value === null) return null;
    return props.images[selectedIndex.value]?.url || null;
});

const triggerFileInput = () => {
    fileInput.value?.click();
};

const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    if (files.length > 0) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
        const validFiles: File[] = [];
        let hasInvalidFiles = false;

        files.forEach(file => {
            const isHeicExt = file.name.toLowerCase().endsWith(".heic");
            if (allowedTypes.includes(file.type) || isHeicExt) {
                validFiles.push(file);
            } else {
                hasInvalidFiles = true;
            }
        });

        if (hasInvalidFiles) {
            alert("Some files were skipped. Please only upload JPG, PNG, or HEIC!");
        }

        if (validFiles.length > 0) {
            emit("files-selected", validFiles);
        }

        input.value = "";
    }
};

const nextImage = () => {
    if (selectedIndex.value !== null && selectedIndex.value < props.images.length - 1) {
        selectedIndex.value++;
    }
};

const prevImage = () => {
    if (selectedIndex.value !== null && selectedIndex.value > 0) {
        selectedIndex.value--;
    }
};
</script>

<template>
    <div class="flex flex-col items-center gap-4 p-6 bg-gray-700 rounded-xl shadow-lg w-full max-w-4xl">
        <input type="file" ref="fileInput" class="hidden" multiple
            accept=".jpg, .jpeg, .png, .heic, image/jpg, image/jpeg, image/png, image/heic" @change="onFileChange" />

        <p class="font-bold text-white">Multiple Images Converter to WebP</p>

        <button
            class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full drop-shadow-md drop-shadow-black hover:drop-shadow-lg transition-colors disabled:bg-blue-300"
            :disabled="isProcessing" @click="triggerFileInput">
            {{ isProcessing ? "Converting..." : "Select Images" }}
        </button>

        <div v-if="images.length > 0" class="mt-4 w-full flex flex-col items-center">
            <p class="text-sm text-white mb-4 italic">WebP Previews (Click to Preview):</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full justify-items-center">
                <div v-for="(img, index) in images" :key="index" class="flex flex-col items-center gap-2">
                    <img :src="img.url" :alt="img.name"
                        class="w-32 h-32 object-cover rounded-lg shadow-2xl border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
                        @click="selectedIndex = index" />
                    <span class="text-xs text-gray-300 truncate w-32 text-center">{{ img.name }}</span>
                </div>
            </div>
        </div>

        <div class="flex gap-4 mt-2">
            <button
                class="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-6 rounded-full drop-shadow-md drop-shadow-black hover:drop-shadow-lg transition-colors disabled:bg-gray-600 disabled:drop-shadow-none disabled:text-gray-400"
                :disabled="isProcessingDownload || images.length === 0" @click="downloadAllWebp">
                {{ isProcessingDownload ? "Downloading..." : "Download All WebP" }}
            </button>
            <button v-if="images.length > 0" @click="$emit('delete-images')"
                class="bg-rose-900 hover:bg-rose-800 text-white font-bold py-2 px-6 rounded-full">
                Clear All
            </button>
        </div>

        <Teleport to="body">
            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                
                <div v-if="currentPreviewUrl"
                    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    @click="selectedIndex = null">
                    <div class="relative max-w-full max-h-full flex items-center justify-center">
                        
                        <button 
                            v-if="selectedIndex !== null && selectedIndex > 0"
                            class="absolute left-2 md:-left-16 text-white hover:text-gray-300 bg-gray-900/50 hover:bg-gray-900/80 transition-colors rounded-full p-2 z-10"
                            @click.stop="prevImage"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <img :src="currentPreviewUrl"
                            class="max-w-[80vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop />
                        
                        <button 
                            v-if="selectedIndex !== null && selectedIndex < images.length - 1"
                            class="absolute right-2 md:-right-16 text-white hover:text-gray-300 bg-gray-900/50 hover:bg-gray-900/80 transition-colors rounded-full p-2 z-10"
                            @click.stop="nextImage"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        <button
                            class="absolute -top-12 right-0 md:-right-16 text-white hover:text-gray-300 bg-gray-900/50 rounded-full p-2"
                            @click="selectedIndex = null">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </transition>
        </Teleport>
    </div>
</template>