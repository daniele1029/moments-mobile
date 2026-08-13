<template>
  <q-dialog
    v-model="opened"
    persistent
    maximized
  >
    <section class="preview-page all-pointer-events">
      <img
        :src="image"
        class="photo"
      >

      <div class="upload-panel">
        <template v-if="uploading">
          <p class="status-title">
            Uploading your memory…
          </p>

          <q-linear-progress
            rounded
            size="10px"
            color="primary"
            track-color="grey-8"
            :value="progress / 100"
          />

          <p class="progress-label">
            {{ progress }}%
          </p>
        </template>

        <template v-else-if="error">
          <p class="status-title">
            We couldn't upload that photo.
          </p>

          <div class="error-actions">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Try Again"
              @click="$emit('retry')"
            />

            <q-btn
              flat
              rounded
              color="white"
              label="Choose Another"
              @click="$emit('choose-another')"
            />
          </div>
        </template>

        <template v-else>
          <p class="status-title">
            Add a caption
            <span>(optional)</span>
          </p>

          <q-input
            :model-value="caption"
            outlined
            rounded
            dark
            maxlength="280"
            placeholder="Write something about this memory..."
            class="caption-input"
            input-class="caption-text"
            @update:model-value="
              $emit(
                'update:caption',
                String($event),
              )
            "
          />

          <p class="character-count">
            {{ caption.length }} / 280
          </p>

          <q-btn
            unelevated
            rounded
            no-caps
            color="primary"
            icon="cloud_upload"
            label="Share Photo"
            class="share-button"
            @click="$emit('upload')"
          />
        </template>
      </div>
    </section>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props =
  defineProps<{
    modelValue: boolean;
    image: string;
    caption: string;
    uploading: boolean;
    progress: number;
    error: boolean;
  }>();

defineEmits<{
  (
    e: "update:modelValue",
    value: boolean,
  ): void;

  (
    e: "update:caption",
    value: string,
  ): void;

  (e: "upload"): void;

  (e: "retry"): void;

  (e: "choose-another"): void;
}>();

const opened =
  computed({
    get: () => props.modelValue,
    set: () => {
      /*
       * Keep the preview open until
       * upload succeeds or the guest
       * chooses another photo.
       */
    },
  });
</script>

<style scoped>
.preview-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: black;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding:
    42px
    24px
    calc(env(safe-area-inset-bottom) + 24px);
  background:
    linear-gradient(
      transparent,
      rgba(0, 0, 0, 0.92)
    );
}

.status-title {
  margin: 0 0 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
}

.status-title span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.8rem;
  font-weight: 500;
}

.caption-input {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 22px;
}

.caption-text {
  color: white;
}

.character-count,
.progress-label {
  margin: 7px 4px 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.76rem;
  text-align: right;
}

.progress-label {
  text-align: center;
}

.share-button {
  width: 100%;
  min-height: 52px;
  font-weight: 700;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
