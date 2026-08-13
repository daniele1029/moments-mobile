<template>
  <div class="slide">
    <q-inner-loading
      :showing="loading && !photo.thumbnailUrl"
      color="white"
    >
      <q-spinner-hearts
        color="white"
        size="48px"
      />
    </q-inner-loading>
    <img
      v-if="photo.thumbnailUrl"
      class="image thumbnail"
      :class="{ hidden: loaded }"
      :src="photo.thumbnailUrl"
      :alt="photo.guestName"
      draggable="false"
    />
    <img
      ref="image"
      class="image full"
      :class="{ loaded }"
      :src="photo.url"
      :alt="photo.guestName"
      draggable="false"
      @load="onLoad"
      @error="onError"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
      @pointerleave="handlePointerCancel"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { imageCache } from "@/utils/image-cache";
import { animateOpen, liftPhoto, releasePhoto, } from "@/animations/moments/open";
import { useMomentsViewerStore, type MomentPhoto, } from "@/stores/moments-viewer-store";
import { useMomentsZoom } from "@/composables/useMomentsZoom";
import { useMomentsGestures } from "@/composables/useMomentsGestures";

const props = defineProps<{
  photo: MomentPhoto;
  index: number;
}>();

const viewer = useMomentsViewerStore();
const image = ref<HTMLImageElement | null>(null);
const loading = ref(true);
const loaded = ref(false);
const zoom = useMomentsZoom(image);
const gestures = useMomentsGestures({ image, zoom });
watch(

  () => props.photo,

  async () => {

    if (!imageCache.has(props.photo.url)) {

      loaded.value = false;

    }

    loading.value = false;

    await nextTick();

    if (!image.value) {

      return;

    }

    animateOpen(image.value);

  },

  {

    immediate: true,

  },

);

watch(

  () => viewer.currentIndex,

  () => {

    preloadImage(

      viewer.previousPhoto?.url,

    );

    preloadImage(

      viewer.nextPhoto?.url,

    );

  },

  {

    immediate: true,

  },

);

function onLoad() {
  loaded.value = true;
  loading.value = false;
  viewer.finishLoading();
}

function onError() {
  loading.value = false;
}

function preloadImage(url?: string,) {
  imageCache.preload(url);
}

function handlePointerDown(event: PointerEvent,) {
  const element = image.value;
  if (!element) { return; }
  ( event.currentTarget as HTMLElement).setPointerCapture( event.pointerId,);
  liftPhoto(element);
  gestures.onPointerDown(event);
}

function handlePointerMove(
  event: PointerEvent,
) {

  gestures.onPointerMove(event);

}

function handlePointerUp(event: PointerEvent) {
  const element = image.value;
  if (!element) { return; }
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId,);

  releasePhoto(element);
  gestures.onPointerUp(event);
}

function handlePointerCancel(event: PointerEvent,) {
  const element = image.value;
  if (!element) {
    return;
  }
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId,);

  releasePhoto(element);

  gestures.onPointerCancel();

}

</script>

<style scoped>

.slide{

  position:relative;

  width:100%;

  height:100%;

  display:flex;

  justify-content:center;

  align-items:center;

  overflow:hidden;

}

.image{

  max-width:100%;

  max-height:100%;

  object-fit:contain;

  opacity:0;

  filter:blur(16px);

  transition:
    opacity .35s,
    filter .35s;

  will-change:
    transform,
    filter,
    box-shadow;

  user-select:none;

  touch-action:none;

}

.image.loaded{

  opacity:1;

  filter:blur(0);

}

.thumbnail{

  position:absolute;

  inset:0;

  object-fit:contain;

  filter:blur(18px);

  transform:scale(1.05);

  transition:

    opacity .35s;

}

.thumbnail.hidden{

  opacity:0;

}

.full{

  position:relative;

  z-index:1;

}

</style>
