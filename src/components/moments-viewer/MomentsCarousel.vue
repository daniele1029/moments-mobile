<template>
  <div
    ref="viewport"
    class="viewport"
  >
    <!-- Previous -->
    <div
      v-if="viewer.previousPhoto"
      class="slide previous"
    >
      <MomentsSlide
        :photo="viewer.previousPhoto"
        :index="viewer.currentIndex - 1"
      />
    </div>
    <!-- Current -->
    <div
      ref="currentSlide"
      class="slide current"
    >
      <MomentsSlide
        v-if="viewer.currentPhoto"
        :photo="viewer.currentPhoto"
        :index="viewer.currentIndex"
      />
    </div>
    <!-- Next -->
    <div
      v-if="viewer.nextPhoto"
      class="slide next"
    >
      <MomentsSlide
        :photo="viewer.nextPhoto"
        :index="viewer.currentIndex + 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import MomentsSlide from "./MomentsSlide.vue";
import { useMomentsViewerStore, } from "@/stores/moments-viewer-store";
import { MomentsGestures } from "@/gestures/moments-gestures";
const viewer = useMomentsViewerStore();
const viewport = ref<HTMLDivElement | null>(null);
const currentSlide = ref<HTMLDivElement | null>(null);
const preloaded = new Set<string>();
let gestures: MomentsGestures | null = null;

function preloadImage(src?: string) {
  if (!src) return;
  preloaded.add(src)
  const image = new Image();
  image.src = src;
}

function resetSlides() {
  if (viewer.previousPhoto) {
    gsap.set(".previous", {
      x: 0,
      xPercent: -100,
    });
  }

  gsap.set(".current", {
    x: 0,
    xPercent: 0,
  });

  if (viewer.nextPhoto) {
    gsap.set(".next", {
      x: 0,
      xPercent: 100,
    });
  }
}

watch(() => viewer.currentIndex,
  async () => {
    await nextTick();
    resetSlides();
    preloadImage(viewer.photos[ viewer.currentIndex - 2 ]?.url);
    preloadImage(viewer.photos[viewer.currentIndex - 1]?.url);
    preloadImage(viewer.photos[viewer.currentIndex + 1]?.url);
    preloadImage(viewer.photos[viewer.currentIndex + 2]?.url);
  },
  { immediate: true },
);

onMounted(() => {
  gestures = new MomentsGestures(
      viewport.value!,
      90,
      {
        onMove(offset) {
          gsap.set(".current", {
            x: offset,
          });
          if (viewer.nextPhoto) {
            gsap.set(".next", {
              x: window.innerWidth + offset,
            });
          }
          if (viewer.previousPhoto) {
            gsap.set(".previous", {
              x: -window.innerWidth + offset,
            });
          }
        },
        onNext() {
          const timeline = gsap.timeline({
            onComplete() {
              viewer.next();
            },
          });
          timeline.to(
            ".current",
            {
              x: -window.innerWidth,
              duration: .28,
              ease: "power2.out",
            },
            0,
          );
          timeline.to(
            ".next",
            {
              x: 0,
              duration: .28,
              ease: "power2.out",
            },
            0,
          );
        },
        onPrevious() {
          const timeline = gsap.timeline({
            onComplete() {
              viewer.previous();
            },
          });
          timeline.to(
            ".current",
            {
              x: window.innerWidth,
              duration: .28,
              ease: "power2.out",
            },
            0,
          );
          timeline.to(
            ".previous",
            {
              x: 0,
              duration: .28,
              ease: "power2.out",
            },
            0,
          );
        },
        onReset() {
          gsap.killTweensOf([
            ".current",
            ".next",
            ".previous",
          ]);
          gsap.set(".current", {
            x: 0,
          });
          gsap.set(".next", {
            x: 0,
          });
          gsap.set(".previous", {
            x: 0,
          });
        }
      }
    );
  resetSlides();
});

onBeforeUnmount(() => {
  gestures?.destroy();
});

</script>

<style scoped>

.viewport{
  position:absolute;
  inset:0;
  overflow:hidden;
  touch-action:none;
}

.slide{
  position:absolute;
  inset:0;
  display:flex;
  justify-content:center;
  align-items:center;
  will-change:transform;
}

</style>
