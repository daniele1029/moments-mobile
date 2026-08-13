<template>

  <div class="grid">

    <GalleryPhotoCard
      v-for="photo in photos"
      :key="photo.id"
      :photo="photo"
      @click="(element) => open(photo, element)"
    />

  </div>

</template>

<script setup lang="ts">
import type {
  GalleryPhoto,
} from "@/services/gallery.service";
import GalleryPhotoCard from "./GalleryPhotoCard.vue";
import { useMomentsViewerStore, type MomentPhoto } from '@/stores/moments-viewer-store';
const props = defineProps<{
  photos: GalleryPhoto[];
  canDelete?: boolean;
}>();

const viewer = useMomentsViewerStore();

function open(
  photo: GalleryPhoto,
  element: HTMLElement,
) {

  const index =
    props.photos.findIndex(
      (p) => p.id === photo.id,
    );

  const momentPhotos: MomentPhoto[] =
    props.photos.map(
      (photo) => ({
        id: photo.id,
        url: photo.url,
        guestName: photo.guestName,
        uploadedAt: photo.uploadedAt,
        caption: photo.caption,
      }),
    );

  viewer.open({
    photos: momentPhotos,
    canDelete: props.canDelete ?? false,
    index,
    element,
  });

}

</script>

<style scoped>

.grid{

  display:grid;

  grid-template-columns:
    repeat(
      2,
      1fr
    );

  gap:10px;

}
</style>
