<template>
  <q-card
    flat
    class="photo-card"
    @click="image && emit('click', image)"
  >
    <div class="image-wrap">
      <img
        ref="image"
        :src="photo.url"
        :alt="`Memory shared by ${photo.guestName}`"
        loading="lazy"
        draggable="false"
      >

      <div class="photo-overlay">
        <q-icon
          name="favorite"
          size="14px"
        />

        <span>
          {{ photo.guestName }}
        </span>
      </div>
    </div>

    <p
      v-if="photo.caption"
      class="caption"
    >
      {{ photo.caption }}
    </p>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type {
  GalleryPhoto,
} from "@/services/gallery.service";

const image =
  ref<HTMLImageElement>();

defineProps<{
  photo: GalleryPhoto;
}>();

const emit =
  defineEmits<{
    (
      e: "click",
      element: HTMLElement,
    ): void;
  }>();
</script>

<style scoped>
.photo-card {
  overflow: hidden;
  border-radius: 20px;
  background: #f1ebf4;
  box-shadow: 0 8px 18px rgba(73, 54, 86, 0.1);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.photo-card:active {
  transform: scale(0.97);
  box-shadow: 0 4px 10px rgba(73, 54, 86, 0.12);
}

.image-wrap {
  position: relative;
}

.image-wrap img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 20px 10px 9px;
  background:
    linear-gradient(
      transparent,
      rgba(0, 0, 0, 0.68)
    );
  color: white;
  font-size: 0.73rem;
  font-weight: 600;
}

.photo-overlay span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caption {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  padding: 10px 11px 12px;
  color: #5b4b62;
  font-size: 0.78rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
