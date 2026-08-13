<template>
  <PhotoPreview
    v-if="previewOpen"
    v-model="previewOpen"
    :image="image"
    :caption="caption"
    :uploading="uploading"
    :progress="uploadProgress"
    :error="uploadError"
    @update:caption="caption = $event"
    @upload="upload"
    @retry="upload"
    @choose-another="chooseAnother"
    @close="reset"
  />

  <q-dialog
    v-if="!previewOpen"
    v-model="opened"
    position="bottom"
    persistent
  >
    <q-card class="capture-sheet">
      <div class="sheet-handle" />

      <div class="sheet-heading">
        <div class="icon-circle">
          <q-icon
            name="photo_camera"
            size="38px"
          />
        </div>

        <div>
          <p class="eyebrow">
            WEDDING MEMORIES
          </p>

          <h2>
            Share a Memory
          </h2>
        </div>
      </div>

      <p class="subtitle">
        Choose how you'd like to add
        a moment to our story.
      </p>

      <button
        class="capture-option primary-option"
        :disabled="auth.remainingUploads <= 0"
        @click="takePhoto"
      >
        <span class="option-icon">
          <q-icon
            name="photo_camera"
            size="30px"
          />
        </span>

        <span class="option-copy">
          <strong>Take a Photo</strong>
          <small>
            Capture a new memory right now.
          </small>
        </span>

        <q-icon
          name="chevron_right"
          size="25px"
          class="option-arrow"
        />
      </button>

      <button
        class="capture-option"
        :disabled="auth.remainingUploads <= 0"
        @click="chooseFromLibrary"
      >
        <span class="option-icon library-icon">
          <q-icon
            name="photo_library"
            size="30px"
          />
        </span>

        <span class="option-copy">
          <strong>Choose from Library</strong>
          <small>
            Share a photo already on your device.
          </small>
        </span>

        <q-icon
          name="chevron_right"
          size="25px"
          class="option-arrow"
        />
      </button>

      <div class="remaining-row">
        <q-icon
          name="favorite"
          size="18px"
        />

        <span>
          {{ auth.remainingUploads }}
          memories remaining
        </span>
      </div>

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

      <!-- Native HTML Media Capture: opens the device camera. -->
      <input
        ref="cameraInput"
        class="native-input"
        type="file"
        accept="image/*"
        capture="environment"
        @change="selectPhoto"
        @cancel="close"
      >

      <!-- Opens the device photo library. -->
      <input
        ref="libraryInput"
        class="native-input"
        type="file"
        accept="image/*"
        @change="selectPhoto"
        @cancel="close"
      >
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
} from "vue";
import axios from "axios";
import { Notify } from "quasar";

import PhotoPreview from "./PhotoPreview.vue";
import uploadService from "@/services/upload.service";

import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { compressPhoto, } from "@/utils/compress-photo";


const ui = useUIStore();
const auth = useAuthStore();
const cameraInput = ref<HTMLInputElement>();
const libraryInput = ref<HTMLInputElement>();
const image = ref("");
const selectedFile = ref<File>();
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadError = ref(false);
const caption = ref("");

const previewOpen = computed({
  get: () => ui.photoPreviewOpen,

  set: (value) => {
    if (value) {
      ui.openPhotoPreview();
      return;
    }

    ui.closePhotoPreview();
  },
});

const opened =
  computed({
    get: () => ui.cameraOpen,
    set: (value) => {
      if (!value) {
        close();
      }
    },
  });

function takePhoto() {
  cameraInput.value?.click();
}

function chooseFromLibrary() {
  libraryInput.value?.click();
}

function selectPhoto(event: Event) {
  const input =
    event.target as HTMLInputElement;

  const file =
    input.files?.[0];

  if (!file) {
    return;
  }

  revokePreview();

  selectedFile.value = file;
  image.value = URL.createObjectURL(file);
  uploadProgress.value = 0;
  uploadError.value = false;

  ui.openPhotoPreview();

  input.value = "";
}

function revokePreview() {
  if (image.value) {
    URL.revokeObjectURL(
      image.value,
    );
  }
}

function reset(closeCamera = true) {
  revokePreview();

  image.value = "";
  caption.value = "";
  selectedFile.value = undefined;
  uploadProgress.value = 0;
  uploadError.value = false;

  ui.closePhotoPreview();

  if (closeCamera) {
    ui.closeCamera();
  }
}

function chooseAnother() {
  reset(false);
  ui.openCamera();
}

function close() {
  ui.closeCamera();
}

async function upload() {
  if (
    !selectedFile.value ||
    !auth.guest ||
    uploading.value
  ) {
    return;
  }

  uploading.value = true;
  uploadError.value = false;
  uploadProgress.value = 0;

  try {
    const originalFile =
      selectedFile.value;

    const file =
      await compressPhoto(
        originalFile,
      );

    const result =
      await uploadService.upload(
        file,
        auth.guest.id,
        file.name,
        caption.value,
        (progress) => {
          uploadProgress.value =
            progress;
        },
      );

    auth.updateUploadState(
      result.photosUsed,
      result.remainingUploads,
    );

    reset();

    Notify.create({
      type: "positive",
      message:
        "Your memory has been shared. ❤️",
    });
  }
  catch (error: unknown) {
    uploadError.value = true;

    if (axios.isAxiosError(error)) {
      console.error(
        "Photo upload failed",
        {
          status: error.response?.status,
          response: error.response?.data,
          message: error.message,
          fileName: selectedFile.value?.name,
          fileType: selectedFile.value?.type,
          fileSize: selectedFile.value?.size,
        },
      );
    }
    else {
      console.error(
        "Photo upload failed",
        error,
      );
    }
  }
  finally {
    uploading.value = false;
  }
}

onBeforeUnmount(() => {
  revokePreview();
});
</script>

<style scoped>
.capture-sheet {
  padding:
    12px
    24px
    calc(env(safe-area-inset-bottom) + 24px);
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background:
    radial-gradient(
      circle at 10% 8%,
      rgba(229, 211, 240, 0.56),
      transparent 30%
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

.sheet-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-circle {
  display: flex;
  width: 66px;
  height: 66px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba(255, 255, 255, 0.72);
  border-radius: 50%;
  background: #eadcf3;
  box-shadow: 0 7px 16px rgba(93, 66, 111, 0.1);
  color: #8f6baf;
}

.eyebrow {
  margin: 0 0 4px;
  color: #a18ba9;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

h2 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 2.25rem;
  line-height: 0.9;
}

.subtitle {
  margin: 19px 0 20px;
  color: #706174;
  line-height: 1.55;
}

.capture-option {
  display: flex;
  width: 100%;
  min-height: 86px;
  align-items: center;
  gap: 13px;
  margin-top: 12px;
  padding: 13px;
  border: 1px solid #ede4f2;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.86);
  color: #4f425f;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.capture-option:active {
  transform: scale(0.98);
}

.capture-option:hover {
  border-color: #cdb4df;
  box-shadow: 0 8px 18px rgba(93, 66, 111, 0.09);
}

.capture-option:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

.primary-option {
  border-color: #ceb4df;
  background:
    linear-gradient(
      135deg,
      #f1e6f8,
      #e3cfee
    );
}

.option-icon {
  display: flex;
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #8f6baf;
  color: white;
}

.library-icon {
  background: #f0e7f7;
  color: #8f6baf;
}

.option-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.option-copy strong {
  color: #57435f;
  font-size: 0.98rem;
}

.option-copy small {
  margin-top: 4px;
  color: #827388;
  font-size: 0.75rem;
  line-height: 1.35;
}

.option-arrow {
  flex: 0 0 auto;
  color: #9f85ae;
}

.remaining-row {
  display: flex;
  justify-content: center;
  gap: 7px;
  margin-top: 20px;
  color: #8f6baf;
  font-size: 0.82rem;
  font-weight: 700;
}

.limit-message {
  margin: 12px 6px 0;
  color: #927080;
  font-size: 0.76rem;
  line-height: 1.5;
  text-align: center;
}

.cancel-button {
  width: 100%;
  margin-top: 10px;
  color: #76677d;
}

.native-input {
  display: none;
}
</style>
