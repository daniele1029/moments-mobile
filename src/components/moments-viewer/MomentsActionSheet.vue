<template>
  <Transition name="sheet">
    <div
      v-if="viewer.actionSheetOpen"
      class="sheet-backdrop"
      @click="viewer.hideActionSheet()"
    >
      <section
        class="action-sheet"
        @click.stop
      >
        <div class="sheet-handle" />

        <div class="sheet-heading">
          <img
            v-if="viewer.currentPhoto"
            :src="viewer.currentPhoto.url"
            alt=""
            class="photo-preview"
          >

          <div class="heading-copy">
            <p class="eyebrow">
              MEMORY OPTIONS
            </p>

            <h2>
              More Actions
            </h2>
          </div>
        </div>

        <div class="action-list">
          <button
            class="action-item"
            @click="downloadPhoto"
          >
            <span class="action-icon">
              <q-icon
                name="download"
                size="25px"
              />
            </span>

            <span class="action-copy">
              <strong>Download Photo</strong>
              <small>Save this memory to your device.</small>
            </span>

            <q-icon
              name="chevron_right"
              size="24px"
              class="action-arrow"
            />
          </button>

          <button
            class="action-item"
            @click="sharePhoto"
          >
            <span class="action-icon">
              <q-icon
                name="ios_share"
                size="25px"
              />
            </span>

            <span class="action-copy">
              <strong>Share Photo</strong>
              <small>Send this memory to someone special.</small>
            </span>

            <q-icon
              name="chevron_right"
              size="24px"
              class="action-arrow"
            />
          </button>

          <button
            class="action-item"
            @click="showInformation"
          >
            <span class="action-icon">
              <q-icon
                name="info_outline"
                size="25px"
              />
            </span>

            <span class="action-copy">
              <strong>Photo Information</strong>
              <small>See when and who shared this memory.</small>
            </span>

            <q-icon
              name="chevron_right"
              size="24px"
              class="action-arrow"
            />
          </button>

          <button
            v-if="viewer.canDelete"
            class="action-item delete-item"
            :disabled="deleting"
            @click="deletePhoto"
          >
            <span class="action-icon delete-icon">
              <q-icon
                name="delete_outline"
                size="25px"
              />
            </span>

            <span class="action-copy">
              <strong>
                {{ deleting ? "Deleting Photo..." : "Delete Photo" }}
              </strong>

              <small>Remove this memory permanently.</small>
            </span>

            <q-icon
              name="chevron_right"
              size="24px"
              class="action-arrow"
            />
          </button>
        </div>

        <q-btn
          flat
          no-caps
          label="Cancel"
          class="cancel-button"
          @click="viewer.hideActionSheet()"
        />
      </section>
    </div>
  </Transition>

  <Transition name="information-fade">
    <div
      v-if="informationOpen"
      class="information-backdrop"
      @click="informationOpen = false"
    >
      <section
        class="information-card"
        @click.stop
      >
        <div class="information-icon">
          <q-icon
            name="favorite"
            size="28px"
          />
        </div>

        <p class="eyebrow">
          WEDDING MEMORY
        </p>

        <h2>
          Photo Information
        </h2>

        <dl>
          <div>
            <dt>Shared by</dt>

            <dd>
              {{ viewer.currentPhoto?.guestName ?? "Unknown guest" }}
            </dd>
          </div>

          <div>
            <dt>Uploaded</dt>

            <dd>
              {{ formatDate(viewer.currentPhoto?.uploadedAt) }}
            </dd>
          </div>
        </dl>

        <q-btn
          unelevated
          rounded
          no-caps
          color="primary"
          label="Done"
          class="done-button"
          @click="informationOpen = false"
        />
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Notify } from "quasar";

import {
  useGalleryStore,
} from "@/stores/gallery-store";

import {
  useMomentsViewerStore,
} from "@/stores/moments-viewer-store";

const viewer =
  useMomentsViewerStore();

const gallery =
  useGalleryStore();

const informationOpen =
  ref(false);

const deleting =
  ref(false);

function getPhoto() {
  return viewer.currentPhoto;
}

async function downloadPhoto() {
  const photo =
    getPhoto();

  if (!photo) {
    return;
  }

  viewer.hideActionSheet();

  try {
    const response =
      await fetch(photo.url);

    if (!response.ok) {
      throw new Error(
        "Unable to download photo.",
      );
    }

    const blob =
      await response.blob();

    const objectUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = objectUrl;

    link.download =
      `moment-${photo.id}.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(objectUrl);

    Notify.create({
      type: "positive",
      message: "Photo download started.",
    });
  } catch (error) {
    console.error(
      "Photo download failed:",
      error,
    );

    Notify.create({
      type: "negative",
      message:
        "We couldn't download this photo. Please try again.",
    });
  }
}

async function sharePhoto() {
  const photo =
    getPhoto();

  if (!photo) {
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Moments Photo",
        text:
          `A memory shared by ${
            photo.guestName ?? "a guest"
          }.`,
        url: photo.url,
      });

      viewer.hideActionSheet();

      return;
    }

    await navigator.clipboard.writeText(
      photo.url,
    );

    viewer.hideActionSheet();

    Notify.create({
      type: "positive",
      message: "Photo link copied to clipboard.",
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return;
    }

    console.error(
      "Photo sharing failed:",
      error,
    );

    Notify.create({
      type: "negative",
      message:
        "Unable to share this photo.",
    });
  }
}

function showInformation() {
  if (!getPhoto()) {
    return;
  }

  viewer.hideActionSheet();

  informationOpen.value = true;
}

async function deletePhoto() {
  const photo =
    getPhoto();

  if (
    !photo ||
    !viewer.canDelete
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      "Delete this photo permanently? This cannot be undone.",
    );

  if (!confirmed) {
    return;
  }

  deleting.value = true;

  try {
    await gallery.deleteMyPhoto(
      photo.id,
    );

    viewer.close();

    Notify.create({
      type: "positive",
      message: "Photo deleted.",
    });
  } catch (error) {
    console.error(
      "Photo deletion failed:",
      error,
    );

    Notify.create({
      type: "negative",
      message:
        "We couldn't delete this photo. Please try again.",
    });
  } finally {
    deleting.value = false;
  }
}

function formatDate(value?: string) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}
</script>

<style scoped>
.sheet-backdrop,
.information-backdrop {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  background: rgba(38, 26, 47, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.sheet-backdrop {
  z-index: 120;
  align-items: flex-end;
}

.action-sheet {
  width: 100%;
  max-width: 520px;
  padding:
    12px
    20px
    calc(env(safe-area-inset-bottom) + 18px);
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background:
    radial-gradient(
      circle at 10% 5%,
      rgba(229, 211, 240, 0.48),
      transparent 30%
    ),
    #fcfafd;
  box-shadow: 0 -14px 42px rgba(0, 0, 0, 0.2);
}

.sheet-handle {
  width: 50px;
  height: 5px;
  margin: 4px auto 22px;
  border-radius: 999px;
  background: #d8cadf;
}

.sheet-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.photo-preview {
  width: 58px;
  height: 58px;
  border: 4px solid white;
  border-radius: 18px;
  box-shadow: 0 6px 14px rgba(73, 54, 86, 0.14);
  object-fit: cover;
}

.heading-copy {
  min-width: 0;
}

.eyebrow {
  margin: 0 0 4px;
  color: #a18ba9;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

h2 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
  line-height: 0.9;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-item {
  display: flex;
  width: 100%;
  min-height: 72px;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid #ede4f2;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.88);
  color: #4f425f;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.action-item:hover {
  border-color: #d4bfdf;
  box-shadow: 0 7px 16px rgba(93, 66, 111, 0.08);
}

.action-item:active {
  transform: scale(0.98);
}

.action-item:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.action-icon {
  display: flex;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #f0e7f7;
  color: #8f6baf;
}

.action-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.action-copy strong {
  color: #57435f;
  font-size: 0.92rem;
}

.action-copy small {
  margin-top: 3px;
  color: #827388;
  font-size: 0.72rem;
  line-height: 1.3;
}

.action-arrow {
  flex: 0 0 auto;
  color: #a48bad;
}

.delete-item {
  border-color: #f0d9dd;
}

.delete-item .action-copy strong {
  color: #b34450;
}

.delete-icon {
  background: #fff0f1;
  color: #c7535f;
}

.cancel-button {
  width: 100%;
  min-height: 48px;
  margin-top: 10px;
  color: #746778;
}

.information-backdrop {
  z-index: 130;
  align-items: center;
  padding: 24px;
}

.information-card {
  width: 100%;
  max-width: 350px;
  padding: 30px 24px 24px;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 28px;
  background: #fcfafd;
  box-shadow: 0 20px 55px rgba(40, 27, 49, 0.25);
  text-align: center;
}

.information-icon {
  display: flex;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0e7f7;
  color: #8f6baf;
}

.information-card dl {
  margin: 22px 0;
  text-align: left;
}

.information-card dl div {
  padding: 13px 0;
  border-bottom: 1px solid #ede4f2;
}

.information-card dl div:last-child {
  border-bottom: none;
}

.information-card dt {
  color: #a18ba9;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.information-card dd {
  margin: 6px 0 0;
  color: #57435f;
  font-size: 0.92rem;
}

.done-button {
  width: 100%;
  min-height: 50px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}

.sheet-enter-active .action-sheet,
.sheet-leave-active .action-sheet {
  transition: transform 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .action-sheet,
.sheet-leave-to .action-sheet {
  transform: translateY(100%);
}

.information-fade-enter-active,
.information-fade-leave-active {
  transition: opacity 0.2s ease;
}

.information-fade-enter-from,
.information-fade-leave-to {
  opacity: 0;
}
</style>
