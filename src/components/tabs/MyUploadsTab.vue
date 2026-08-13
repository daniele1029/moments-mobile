<template>
  <section class="uploads-tab">
    <header class="uploads-header">
      <div class="header-icon">
        <q-icon
          name="collections"
          size="24px"
        />
      </div>

      <div>
        <p class="eyebrow">
          YOUR WEDDING MEMORIES
        </p>

        <h1>
          My Uploads
        </h1>
      </div>
    </header>

    <section class="summary-card">
      <div class="summary-icon">
        <q-icon
          name="favorite"
          size="26px"
        />
      </div>

      <div class="summary-copy">
        <h2>
          Your little chapter
        </h2>

        <p>
          {{ photosUsed }} of {{ photoLimit }}
          memories shared
        </p>
      </div>

      <div class="summary-count">
        {{ remainingUploads }}
        <span>left</span>
      </div>
    </section>

    <div
      v-if="gallery.myGalleryLoading"
      class="loading"
    >
      <q-spinner
        color="primary"
        size="48px"
      />
    </div>

    <GalleryGrid
      v-else-if="gallery.myGallery.length > 0"
      :photos="gallery.myGallery"
      :can-delete="true"
    />

    <div
      v-else
      class="empty"
    >
      <div class="empty-icon">
        <q-icon
          name="add_a_photo"
          size="38px"
        />
      </div>

      <h2>
        Your story starts here
      </h2>

      <p>
        The memories you share
        will appear in this collection.
      </p>

      <q-btn
        unelevated
        rounded
        no-caps
        color="primary"
        icon="photo_camera"
        label="Share a Memory"
        class="share-button"
        :disable="remainingUploads <= 0"
        @click="ui.openCamera()"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  watch,
} from "vue";

import GalleryGrid
  from "@/components/gallery/GalleryGrid.vue";

import {
  useAuthStore,
} from "@/stores/auth-store";

import {
  HomeTab,
  useUIStore,
} from "@/stores/ui-store";

import {
  useGalleryStore,
} from "@/stores/gallery-store";

const auth =
  useAuthStore();

const ui =
  useUIStore();

const gallery =
  useGalleryStore();

const photosUsed =
  computed(() =>
    auth.guest?.photosUsed ?? 0,
  );

const photoLimit =
  computed(() =>
    auth.guest?.photoLimit ?? 0,
  );

const remainingUploads =
  computed(() =>
    auth.remainingUploads,
  );

/*
 * Refresh whenever this tab is opened,
 * including after the guest uploads a photo.
 */
watch(
  () => ui.currentTab,
  (tab) => {
    if (tab === HomeTab.MY_UPLOADS) {
      void gallery.fetchMyGallery();
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.uploads-tab {
  min-height: 100%;
  padding: 28px 24px 128px;
  background:
    radial-gradient(
      circle at 90% 7%,
      rgba(220, 200, 238, 0.3),
      transparent 28%
    ),
    #fcfafd;
}

.uploads-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.header-icon {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0e7f7;
  color: #8f6baf;
}

.eyebrow {
  margin: 0 0 2px;
  color: #a18ba9;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.13em;
}

h1 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 2.45rem;
  line-height: 1;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 24px;
  padding: 17px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  background:
    linear-gradient(
      135deg,
      #efe4f6,
      #dfcbed
    );
  box-shadow: 0 12px 28px rgba(99, 69, 120, 0.12);
}

.summary-icon {
  display: flex;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  color: #8f6baf;
}

.summary-copy {
  min-width: 0;
  flex: 1;
}

.summary-copy h2 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.55rem;
  line-height: 1;
}

.summary-copy p {
  margin: 7px 0 0;
  color: #675a70;
  font-size: 0.82rem;
}

.summary-count {
  display: flex;
  min-width: 44px;
  flex-direction: column;
  color: #6d4785;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 0.75;
  text-align: center;
}

.summary-count span {
  margin-top: 7px;
  color: #806a8d;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 600;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.empty {
  display: flex;
  min-height: 42vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  display: flex;
  width: 78px;
  height: 78px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0e7f7;
  color: #8f6baf;
}

.empty h2 {
  margin: 22px 0 8px;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
}

.empty p {
  max-width: 240px;
  margin: 0 0 22px;
  color: #888;
  line-height: 1.7;
}

.share-button {
  min-height: 50px;
  padding: 0 24px;
  box-shadow: 0 9px 18px rgba(98, 66, 122, 0.22);
}
</style>
