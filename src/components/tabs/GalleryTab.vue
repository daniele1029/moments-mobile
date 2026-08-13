<template>
  <section class="gallery-tab">
    <header class="gallery-header">
      <div class="header-icon">
        <q-icon
          name="photo_camera"
          size="24px"
        />
      </div>

      <div>
        <p class="eyebrow">
          WEDDING MEMORIES
        </p>

        <h1>
          Gallery
        </h1>
      </div>
    </header>

    <div class="gallery-switcher">
      <button
        class="switch-button"
        :class="{
          active: activeCollection === 'guest',
        }"
        @click="activeCollection = 'guest'"
      >
        Guest Photos
      </button>

      <button
        class="switch-button"
        :class="{
          active: activeCollection === 'photobooth',
        }"
        @click="activeCollection = 'photobooth'"
      >
        Photobooth
      </button>
    </div>

    <template v-if="activeCollection === 'guest'">
      <section class="intro-card">
        <div>
          <h2>
            Moments shared
            with love.
          </h2>

          <p>
            A collection of memories
            from everyone celebrating with us.
          </p>
        </div>

        <q-icon
          name="favorite"
          size="28px"
          class="intro-icon"
        />
      </section>

      <div
        v-if="gallery.loading"
        class="loading"
      >
        <q-spinner
          color="primary"
          size="48px"
        />
      </div>

      <GalleryGrid
        v-else-if="gallery.gallery.length > 0"
        :photos="gallery.gallery"
      />

      <div
        v-else
        class="empty"
      >
        <div class="empty-icon">
          <q-icon
            name="photo_library"
            size="40px"
          />
        </div>

        <h2>
          Memories are on their way
        </h2>

        <p>
          Photos shared by your guests
          will appear here.
        </p>
      </div>

      <div
        v-if="gallery.loadingMore"
        class="loading-more"
      >
        <q-spinner
          color="primary"
          size="24px"
        />
      </div>

      <div
        ref="sentinel"
        class="gallery-sentinel"
      />
    </template>

    <template v-else>
      <section class="photobooth-card">
        <div class="strip-icon">
          <q-icon
            name="view_agenda"
            size="34px"
          />
        </div>

        <div>
          <h2>
            Photobooth Moments
          </h2>

          <p>
            Strike a pose, make a memory.
          </p>

          <span class="photobooth-label">
            PHOTOBOOTH
          </span>
        </div>
      </section>


      <div
        v-if="photobooth.loading"
        class="loading"
      >
        <q-spinner
          color="primary"
          size="48px"
        />
      </div>
      <GalleryGrid
        v-else-if="photobooth.gallery.length > 0"
        :photos="photobooth.gallery"
      />

      <div
        v-else
        class="empty"
      >
        <div class="empty-icon">
          <q-icon
            name="photo_library"
            size="40px"
          />
        </div>

        <h2>
          Memories are on their way
        </h2>

        <p>
          Photos shared by your guests
          will appear here.
        </p>
      </div>

      <div
        v-if="photobooth.loadingMore"
        class="loading-more"
      >
        <q-spinner
          color="primary"
          size="24px"
        />
      </div>

      <div
        ref="sentinel"
        class="gallery-sentinel"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

import GalleryGrid
  from "@/components/gallery/GalleryGrid.vue";

import {
  useGalleryStore,
} from "@/stores/gallery-store";

const gallery =
  useGalleryStore();

const photobooth =
  useGalleryStore("photo_booth");


const activeCollection =
  ref<"guest" | "photobooth">(
    "guest",
  );

const sentinel =
  ref<HTMLDivElement | null>(
    null,
  );

let observer:
  IntersectionObserver | null =
  null;

onMounted(() => {
  if (gallery.gallery.length === 0) {
    void gallery.fetchGallery();
  }
  if (photobooth.gallery.length === 0) {
    void photobooth.fetchGallery();
  }

  observer =
    new IntersectionObserver(
      (entries) => {
        const entry =
          entries.at(0);

        if (!entry?.isIntersecting) {
          return;
        }
        if (
          activeCollection.value !== "guest"
        ) {
          void photobooth.loadMore();
        } else {
          void gallery.loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

  if (sentinel.value) {
    observer.observe(
      sentinel.value,
    );
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.gallery-tab {
  min-height: 100%;
  padding: 28px 24px 128px;
  background:
    radial-gradient(
      circle at 8% 5%,
      rgba(220, 200, 238, 0.3),
      transparent 25%
    ),
    #fcfafd;
}

.gallery-header {
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

.gallery-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 24px;
  padding: 4px;
  border: 1px solid #e7ddec;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
}

.switch-button {
  min-height: 45px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #84758b;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.switch-button.active {
  background: #8f6baf;
  box-shadow: 0 5px 12px rgba(98, 66, 122, 0.2);
  color: white;
}

.intro-card,
.photobooth-card {
  display: flex;
  min-height: 118px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(99, 69, 120, 0.12);
}

.intro-card {
  background:
    linear-gradient(
      135deg,
      #efe4f6,
      #dfcbed
    );
}

.photobooth-card {
  background:
    radial-gradient(
      circle at 90% 20%,
      rgba(255, 255, 255, 0.55),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #eadcf4,
      #d4bce8
    );
}

.intro-card h2,
.photobooth-card h2 {
  margin: 0;
  color: #4f425f;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  line-height: 1;
}

.intro-card p,
.photobooth-card p {
  max-width: 230px;
  margin: 10px 0 0;
  color: #675a70;
  font-size: 0.86rem;
  line-height: 1.55;
}

.intro-icon {
  flex: 0 0 auto;
  color: #9a6ebc;
}

.strip-icon {
  display: flex;
  width: 66px;
  height: 78px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba(255, 255, 255, 0.72);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  color: #8f6baf;
  transform: rotate(-7deg);
}

.photobooth-label {
  display: inline-block;
  margin-top: 12px;
  padding: 5px 10px;
  border: 1px solid rgba(143, 107, 175, 0.3);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.52);
  color: #7d5a98;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 24px 0 6px;
}

.empty {
  display: flex;
  min-height: 42vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.photobooth-empty {
  min-height: 34vh;
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
  max-width: 235px;
  margin: 0;
  color: #888;
  line-height: 1.7;
}

.gallery-sentinel {
  height: 1px;
}
</style>
