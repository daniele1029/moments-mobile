<template>
  <img
    :src="monogram"
    :alt="alt"
    class="wedding-monogram"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
</template>

<script setup lang="ts">
import monogram from "@/assets/monogram.png";

withDefaults(
  defineProps<{
    size?: number;
    alt?: string;
  }>(),
  {
    size: 64,
    alt: "Daniele and Kath wedding monogram",
  },
);
</script>

<style scoped>
.wedding-monogram {
  display: block;
  object-fit: contain;
}
</style>
