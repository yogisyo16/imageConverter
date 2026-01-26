<script setup lang="ts">
import { ref } from "vue";
import NavbarType from "./components/NavbarType.vue";
import AdComponent from "./components/AddComponent.vue";
import WebpConverter from "./pages/WebpConverter.vue";
// import JpgToPng from "./pages/JpgToPng.vue"; // You'll create this later

const currentPage = ref("webp");
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-600">
        <NavbarType
            :current-page="currentPage"
            @change-page="(p) => (currentPage = p)"
        />

        <main class="flex grow items-center justify-center py-10">
            <WebpConverter v-if="currentPage === 'webp'" />
            <div
                v-else-if="currentPage === 'jpg-png'"
                class="text-white font-bold"
            >
                Coming Soon: JPG to PNG Converter!
            </div>
            <div
                v-else-if="currentPage === 'help'"
                class="text-white font-bold"
            >
                YOU SHALL NOT PASS!!!!!
            </div>
        </main>

        <footer class="p-4 bg-gray-800">
            <AdComponent />
        </footer>
    </div>
</template>
