<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
    try {
        // This triggers the ad loading once the component is visible
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
            {},
        );
    } catch (e) {
        console.error("Ad failed to load", e);
    }
});
</script>

<template>
    <div class="my-8 flex justify-center">
        <ins
            class="adsbygoogle"
            style="display: block"
            data-ad-client="ca-pub-3087535315836409"
            data-ad-slot="f08c47fec0942fa0"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    </div>
</template>
