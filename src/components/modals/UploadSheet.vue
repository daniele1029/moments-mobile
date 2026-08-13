<template>
  <q-dialog
    :model-value="ui.uploadOpen"
    position="bottom"
    persistent
    @update:model-value="close"
  >
    <q-card class="upload-sheet">
      <div class="sheet-handle" />

      <div class="icon-circle">
        <q-icon
          name="photo_camera"
          size="42px"
        />
      </div>

      <p class="eyebrow">
        WEDDING MEMORIES
      </p>

      <h2>
        Share a Memory
      </h2>

      <div class="heart-divider">
        <span />
        <q-icon
          name="favorite_border"
          size="20px"
        />
        <span />
      </div>

      <p class="subtitle">
        Every photo you share becomes
        part of our wedding story.
      </p>

      <div class="remaining-card">
        <div class="remaining-icon">
          <q-icon
            name="favorite"
            size="22px"
          />
        </div>

        <div>
          <strong>
            {{ auth.remainingUploads }}
            memories remaining
          </strong>

          <span>
            Capture a moment worth keeping.
          </span>
        </div>
      </div>

      <q-btn
        unelevated
        rounded
        no-caps
        icon="photo_camera"
        label="Take or Choose a Photo"
        class="share-button"
        :disable="auth.remainingUploads <= 0"
        @click="openCamera"
      />

      <p
        v-if="auth.remainingUploads <= 0"
        class="limit-message"
      >
        You've shared all your available memories.
        Thank you for celebrating with us.
      </p>

      <q-btn
        flat
        no-caps
        label="Not now"
        class="cancel-button"
        @click="close"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  useAuthStore,
} from "@/stores/auth-store";

import {
  useUIStore,
} from "@/stores/ui-store";

const ui =
  useUIStore();

const auth =
  useAuthStore();

function openCamera() {
  ui.closeUpload();

  ui.openCamera();
}

function close() {
  ui.closeUpload();
}
</script>

<style scoped>
.upload-sheet {
  padding:
    12px
    24px
    calc(env(safe-area-inset-bottom) + 24px);
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background:
    radial-gradient(
      circle at 12% 10%,
      rgba(229, 211, 240, 0.52),
      transparent 28%
    ),
    #fcfafd;
}

.sheet-handle {
  width: 50px;
  height: 5px;
  margin: 4px auto 24px;
  border-radius: 999px;
  background: #d8cadf;
}

.icon-circle {
  display: flex;
  width: 82px;
  height: 82px;
  margin: 0 auto 18px;
  align-items: center;
  justify-content: center;
  border: 7px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  background: #eadcf3;
  box-shadow: 0 8px 20px rgba(93, 66, 111, 0.12);
  color: #8f6baf;
}

.eyebrow {
  margin: 0 0 8px;
  color: #a18ba9;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-align: center;
}

h2 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 2.65rem;
  line-height: 1;
  text-align: center;
}

.heart-divider {
  display: flex;
  width: 150px;
  margin: 17px auto 0;
  align-items: center;
  gap: 10px;
  color: #a87dca;
}

.heart-divider span {
  height: 1px;
  flex: 1;
  background: rgba(143, 107, 175, 0.42);
}

.subtitle {
  max-width: 290px;
  margin: 16px auto 22px;
  color: #706174;
  line-height: 1.65;
  text-align: center;
}

.remaining-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 13px;
  border: 1px solid #eee5f2;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
}

.remaining-icon {
  display: flex;
  width: 43px;
  height: 43px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1e8f7;
  color: #8f6baf;
}

.remaining-card strong,
.remaining-card span {
  display: block;
}

.remaining-card strong {
  color: #57435f;
  font-size: 0.88rem;
}

.remaining-card span {
  margin-top: 3px;
  color: #908291;
  font-size: 0.73rem;
}

.share-button {
  width: 100%;
  min-height: 56px;
  background: #8f6baf;
  box-shadow: 0 10px 20px rgba(98, 66, 122, 0.25);
  color: white;
  font-size: 0.98rem;
  font-weight: 700;
}

.cancel-button {
  width: 100%;
  margin-top: 10px;
  color: #76677d;
}

.limit-message {
  margin: 14px 8px 0;
  color: #927080;
  font-size: 0.78rem;
  line-height: 1.5;
  text-align: center;
}
</style>
