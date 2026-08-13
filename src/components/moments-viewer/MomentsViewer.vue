<template>
  <Teleport to="body">
    <Transition
      name="viewer-fade"
      appear
    >
      <div
        v-if="viewer.opened"
        ref="viewerElement"
        class="moments-viewer"
        @click="viewer.toggleToolbar()"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
        @pointercancel="pointerUp"
      >
        <div
          ref="backgroundElement"
          class="viewer-background"
        />

        <div class="top-scrim" />

        <MomentsToolbar />

        <div class="viewer-content">
          <MomentsCarousel />
        </div>

        <Transition name="fade">
          <div
            v-if="viewer.currentPhoto"
            v-show="!viewer.isZoomed"
            class="viewer-details"
          >
            <div class="memory-label">
              <q-icon
                name="favorite"
                size="13px"
              />
              WEDDING MEMORY
            </div>

            <div class="guest-row">
              <div class="guest-avatar">
                {{ viewer.currentPhoto.guestName?.charAt(0) ?? "?" }}
              </div>

              <div class="guest-copy">
                <strong>
                  {{ viewer.currentPhoto.guestName }}
                </strong>

                <span>
                  {{ formatUploadedAt(viewer.currentPhoto.uploadedAt) }}
                </span>
              </div>
            </div>

            <p
              v-if="viewer.currentPhoto.caption"
              class="photo-caption"
            >
              {{ viewer.currentPhoto.caption }}
            </p>
          </div>
        </Transition>

        <MomentsLoader />
        <MomentsActionSheet />

        <Transition name="fade">
          <div
            v-if="viewer.currentPhoto"
            v-show="!viewer.isZoomed"
            class="viewer-bottom-bar"
            @click.stop
          >
            <div class="photo-counter">
              <span class="counter-current">
                {{ viewer.currentIndex + 1 }}
              </span>

              <span class="counter-total">
                of {{ viewer.total }}
              </span>
            </div>

            <q-btn
              flat
              round
              icon="more_horiz"
              class="bottom-action-button"
              aria-label="More photo actions"
              @click="viewer.showActionSheet()"
            />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
} from "vue";
import { gsap } from "gsap";

import { useMomentsViewerStore } from "@/stores/moments-viewer-store";

import MomentsActionSheet from "./MomentsActionSheet.vue";
import MomentsCarousel from "./MomentsCarousel.vue";
import MomentsLoader from "./MomentsLoader.vue";
import MomentsToolbar from "./MomentsToolbar.vue";

const viewer = useMomentsViewerStore();

const viewerElement =
  ref<HTMLDivElement | null>(null);

const backgroundElement =
  ref<HTMLDivElement | null>(null);

let dragging = false;
let startY = 0;
let currentY = 0;

function formatUploadedAt(value?: string) {
  if (!value) {
    return "Shared recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Shared recently";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}

function pointerDown(event: PointerEvent) {
  const target =
    event.target as HTMLElement;

  if (
    viewer.isZoomed ||
    target.closest("button, .q-btn, input, textarea")
  ) {
    return;
  }

  dragging = true;
  startY = event.clientY;
  currentY = 0;
}

function pointerMove(event: PointerEvent) {
  if (!dragging) {
    return;
  }

  currentY =
    Math.max(
      0,
      event.clientY - startY,
    );

  viewer.setDismissOffset(currentY);
}

function pointerUp() {
  if (!dragging) {
    return;
  }

  dragging = false;

  if (currentY > 160) {
    viewer.close();
  }
  else {
    gsap.to(viewer, {
      dismissOffset: 0,
      duration: 0.25,
      ease: "power2.out",
      onUpdate() {
        viewer.setDismissOffset(
          viewer.dismissOffset,
        );
      },
    });
  }

  currentY = 0;
}

watch(
  () => viewer.dismissOffset,
  (offset) => {
    if (viewerElement.value) {
      gsap.set(viewerElement.value, {
        y: offset,
      });
    }

    if (backgroundElement.value) {
      gsap.set(backgroundElement.value, {
        opacity:
          1 -
          Math.min(
            Math.abs(offset) / 300,
            0.82,
          ),
      });
    }
  },
);
</script>

<style scoped>
.moments-viewer {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: #1e1724;
  touch-action: pan-x;
}

.viewer-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 15%,
      #503c60 0%,
      #2a2032 42%,
      #17121b 100%
    );
}

.top-scrim {
  position: absolute;
  inset: 0 0 auto;
  z-index: 10;
  height: 180px;
  pointer-events: none;
  background:
    linear-gradient(
      rgba(18, 13, 22, 0.7),
      transparent
    );
}

.viewer-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  padding:
    calc(env(safe-area-inset-top) + 64px)
    0
    calc(env(safe-area-inset-bottom) + 210px);
}

.viewer-details {
  position: absolute;
  z-index: 40;
  right: 16px;
  bottom: calc(env(safe-area-inset-bottom) + 88px);
  left: 16px;
  padding: 15px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  background: rgba(42, 31, 50, 0.78);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  pointer-events: none;
}

.memory-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  color: #dfc8ee;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.guest-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.guest-avatar {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.38);
  border-radius: 50%;
  background: #a47cc0;
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.25rem;
  font-weight: 700;
}

.guest-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.guest-copy strong {
  overflow: hidden;
  color: white;
  font-size: 0.92rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guest-copy span {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.67);
  font-size: 0.75rem;
}

.photo-caption {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.88rem;
  line-height: 1.48;
}

.viewer-bottom-bar {
  position: absolute;
  z-index: 45;
  right: 16px;
  bottom: calc(env(safe-area-inset-bottom) + 16px);
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.19);
  border-radius: 999px;
  background: rgba(42, 31, 50, 0.82);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.photo-counter {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.counter-current {
  color: white;
  font-size: 1rem;
  font-weight: 700;
}

.counter-total {
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.8rem;
}

.bottom-action-button {
  width: 42px;
  height: 42px;
  background: #9c75b9;
  color: white;
}

.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}
</style>
