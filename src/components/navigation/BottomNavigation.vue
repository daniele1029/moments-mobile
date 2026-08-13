<template>
  <nav class="navigation">
    <q-btn
      v-if="auth.remainingUploads > 0"
      round
      unelevated
      icon="photo_camera"
      class="camera-button"
      aria-label="Share a photo"
      @click="ui.openCamera()"
    />

    <div
      class="nav-shell"
      :class="{
        completed: auth.remainingUploads <= 0,
      }"
    >
      <button
        class="nav-item"
        :class="{
          active: ui.currentTab === HomeTab.GALLERY,
        }"
        @click="ui.goGallery()"
      >
        <q-icon
          name="photo_library"
          size="25px"
        />

        <span>
          Gallery
        </span>
      </button>

      <button
        class="nav-item"
        :class="{
          active: ui.currentTab === HomeTab.HOME,
        }"
        @click="ui.goHome()"
      >
        <q-icon
          name="home"
          size="25px"
        />

        <span>
          Home
        </span>
      </button>

      <button
        class="nav-item"
        :class="{
          active: ui.currentTab === HomeTab.MY_UPLOADS,
        }"
        @click="ui.goMyUploads()"
      >
        <q-icon
          name="cloud_upload"
          size="25px"
        />

        <span>
          My Uploads
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  useAuthStore,
} from "@/stores/auth-store";

import {
  HomeTab,
  useUIStore,
} from "@/stores/ui-store";

const auth =
  useAuthStore();

const ui =
  useUIStore();
</script>

<style scoped>
.navigation {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  padding:
    0
    12px
    max(12px, env(safe-area-inset-bottom));
  pointer-events: none;
}

.nav-shell {
  position: relative;
  display: grid;
  min-height: 92px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 10px 8px;
  border: 1px solid rgba(255, 255, 255, 0.84);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 12px 34px rgba(73, 54, 86, 0.16);
  backdrop-filter: blur(18px);
  pointer-events: auto;
}

.nav-item {
  display: flex;
  min-width: 0;
  min-height: 68px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  border-radius: 22px;
  background: transparent;
  color: #8e8e98;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    transform 0.18s ease;
}

.nav-item span {
  overflow: hidden;
  font-size: 0.72rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-item.active {
  background: #f0e7f7;
  color: #8f6baf;
}

.nav-item:active {
  transform: scale(0.94);
}

.camera-button {
  position: absolute;
  z-index: 2;
  top: -47px;
  left: 50%;
  width: 76px;
  height: 76px;
  transform: translateX(-50%);
  border: 6px solid #fcfafd;
  background: #8f6baf;
  box-shadow:
    0 12px 24px rgba(82, 53, 103, 0.3);
  color: white;
  pointer-events: auto;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.camera-button:active {
  transform: translateX(-50%) scale(0.93);
}

.nav-shell.completed {
  min-height: 82px;
}

@media (max-width: 350px) {
  .nav-item span {
    font-size: 0.65rem;
  }

  .nav-shell {
    padding-right: 4px;
    padding-left: 4px;
  }
}
</style>
