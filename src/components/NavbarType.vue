<script setup lang="ts">
import { ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

defineProps<{ currentPage: string }>();
const emit = defineEmits(["change-page"]);

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const handlePageChange = (page: string) => {
    emit("change-page", page);
    isMenuOpen.value = false;
};
</script>

<template>
    <nav class="relative bg-gray-800/50 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <div class="shrink-0">
                    <span class="text-white font-bold text-lg">Imager</span>
                </div>

                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <Menu as="div" class="relative inline-block">
                            <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                                Options
                                <ChevronDownIcon class="-mr-1 size-5 text-gray-400" aria-hidden="true" />
                            </MenuButton>
                            
                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
                                
                                <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-white/10 rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 overflow-hidden">
                                    <div class="py-1 flex flex-col">
                                        
                                        <MenuItem v-slot="{ close }">
                                            <button @click="emit('change-page', 'webp'); close()" :class="[
                                                currentPage === 'webp'
                                                    ? 'bg-gray-950 text-white'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                            ]" class="block w-full text-left px-3 py-2 text-sm font-medium transition-colors">
                                                WebP Converter (Single)
                                            </button>
                                        </MenuItem>
                                        
                                        <MenuItem v-slot="{ close }">
                                            <button @click="emit('change-page', 'webp-multi'); close()" :class="[
                                                currentPage === 'webp-multi'
                                                    ? 'bg-gray-950 text-white'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                            ]" class="block w-full text-left px-3 py-2 text-sm font-medium transition-colors">
                                                WebP Converter (Multiple)
                                            </button>
                                        </MenuItem>

                                    </div>
                                </MenuItems>
                            </transition>
                        </Menu>

                        <button @click="emit('change-page', 'jpg-png')" :class="[
                            currentPage === 'jpg-png'
                                ? 'bg-gray-950 text-white'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white',
                        ]" class="rounded-md px-3 py-2 text-sm font-medium transition-colors">
                            JPG to PNG
                        </button>
                        <div class="flex ">
                            <button @click="emit('change-page', 'help')" :class="[
                                currentPage === 'help'
                                    ? 'bg-gray-950 text-white'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                            ]" class="rounded-md px-3 py-2 text-sm font-medium transition-colors">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>

                <div class="md:hidden">
                    <button @click="toggleMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                        <span class="sr-only">Open main menu</span>
                        <svg v-if="!isMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0">
            <div v-show="isMenuOpen" class="absolute left-0 right-0 md:hidden bg-gray-800 border-b border-white/10 shadow-2xl z-50">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button @click="handlePageChange('webp')" :class="[
                        currentPage === 'webp'
                            ? 'bg-gray-950 text-white'
                            : 'text-gray-300 hover:bg-white/5',
                    ]" class="block w-full text-left rounded-md px-3 py-2 text-base font-medium">
                        WebP Converter (Single)
                    </button>

                    <button @click="handlePageChange('webp-multi')" :class="[
                        currentPage === 'webp-multi'
                            ? 'bg-gray-950 text-white'
                            : 'text-gray-300 hover:bg-white/5',
                    ]" class="block w-full text-left rounded-md px-3 py-2 text-base font-medium">
                        WebP Converter (Multiple)
                    </button>

                    <button @click="handlePageChange('jpg-png')" :class="[
                        currentPage === 'jpg-png'
                            ? 'bg-gray-950 text-white'
                            : 'text-gray-300 hover:bg-white/5',
                    ]" class="block w-full text-left rounded-md px-3 py-2 text-base font-medium">
                        JPG to PNG
                    </button>
                    
                    <button @click="handlePageChange('help')" :class="[
                        currentPage === 'help'
                            ? 'bg-gray-950 text-white'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    ]" class="block w-full text-left rounded-md px-3 py-2 text-base font-medium transition-colors">
                        Contact
                    </button>
                </div>
            </div>
        </transition>
    </nav>
</template>