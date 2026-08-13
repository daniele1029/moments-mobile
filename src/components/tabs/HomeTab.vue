<template>
  <section class="home-tab">
    <header class="welcome">
      <div class="welcome-icon">
        <q-icon
          name="favorite"
          size="19px"
        />
      </div>

      <div>
        <p class="eyebrow">
          WELCOME
        </p>

        <h1>
          Hello, {{ firstName }}
        </h1>
      </div>
    </header>

    <main class="content">
      <section class="memory-card">
        <span class="sparkle sparkle-one">✦</span>
        <span class="sparkle sparkle-two">✦</span>

        <div class="monogram-circle">
          <WeddingMonogram :size="50" />
        </div>

        <template v-if="uploadsComplete">
          <h2>
            Thank You for Sharing
          </h2>

          <div class="heart-divider">
            <span />
            <q-icon
              name="favorite"
              size="19px"
            />
            <span />
          </div>

          <p>
            You've shared every memory
            available to you.
          </p>

          <q-btn
            unelevated
            rounded
            no-caps
            disable
            icon="check_circle"
            label="All Photos Shared"
            class="share-button completed-button"
          />

          <q-btn
            unelevated
            rounded
            no-caps
            icon="photo_library"
            label="Explore Gallery"
            class="gallery-button"
            @click="ui.goGallery()"
          />
        </template>

        <template v-else>
          <h2>
            Share a Memory
          </h2>

          <div class="heart-divider">
            <span />
            <q-icon
              name="favorite_border"
              size="22px"
            />
            <span />
          </div>

          <p>
            Every photo becomes part
            of our wedding story.
          </p>

          <q-btn
            unelevated
            rounded
            no-caps
            icon="photo_camera"
            label="Take or Choose a Photo"
            class="share-button"
            @click="ui.openCamera()"
          />
        </template>
      </section>

      <section class="progress-card">
        <div class="progress-icon">
          <q-icon
            name="favorite"
            size="23px"
          />
        </div>

        <div class="progress-content">
          <div class="progress-label">
            {{ photosUsed }} of {{ photoLimit }}
            memories shared
          </div>

          <q-linear-progress
            rounded
            size="9px"
            color="primary"
            track-color="grey-3"
            :value="uploadProgress"
          />
        </div>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import WeddingMonogram from "@/components/shared/WeddingMonogram.vue";

const auth = useAuthStore();
const ui = useUIStore();

const firstName = computed(() => {
  const fullName =
    auth.guest?.fullName ?? "Guest";

  return fullName.split(" ")[0] || "Guest";
});

const photosUsed = computed(
  () => auth.guest?.photosUsed ?? 0,
);

const photoLimit = computed(
  () => auth.guest?.photoLimit ?? 0,
);

const uploadsComplete = computed(
  () =>
    photoLimit.value > 0 &&
    photosUsed.value >= photoLimit.value,
);

const uploadProgress = computed(() => {
  if (photoLimit.value <= 0) {
    return 0;
  }

  return Math.min(
    photosUsed.value / photoLimit.value,
    1,
  );
});
</script>

<style scoped>
.home-tab {
  box-sizing: border-box;
  min-height: calc(100dvh - 132px);
  padding: 22px 24px;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 8% 9%,
      rgba(224, 204, 238, 0.35),
      transparent 28%
    ),
    #fcfafd;
}

.welcome {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #f0e7f7;
  color: #8f6baf;
}

.eyebrow {
  margin: 0 0 3px;
  color: #a18ba9;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

h1,
h2 {
  font-family: "Cormorant Garamond", serif;
}

h1 {
  margin: 0;
  color: #4f425f;
  font-size: 2.2rem;
  font-weight: 500;
  line-height: 0.95;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 28px;
}

.memory-card {
  position: relative;
  overflow: hidden;
  padding: 23px 22px 20px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 29px;
  background:
    radial-gradient(
      circle at 14% 17%,
      rgba(255, 255, 255, 0.72),
      transparent 21%
    ),
    linear-gradient(
      145deg,
      #f0e6f7,
      #ddc8ed
    );
  box-shadow: 0 16px 32px rgba(96, 67, 116, 0.14);
  text-align: center;
}

.monogram-circle {
  display: grid;
  width: 68px;
  height: 68px;
  margin: 0 auto 14px;
  place-items: center;
  border: 7px solid rgba(255, 255, 255, 0.48);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 8px 18px rgba(92, 61, 112, 0.14);
}

.monogram {
  color: #8f6baf;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.38rem;
  font-weight: 700;
  letter-spacing: -0.08em;
}

.monogram span {
  display: inline-block;
  margin: 0 2px;
  font-size: 0.78rem;
  vertical-align: middle;
}

h2 {
  margin: 0;
  color: #4b3156;
  font-size: clamp(2.25rem, 9vw, 3rem);
  font-weight: 500;
  line-height: 0.95;
}

.heart-divider {
  display: flex;
  max-width: 164px;
  align-items: center;
  gap: 10px;
  margin: 13px auto 0;
  color: #a87dca;
}

.heart-divider span {
  height: 1px;
  flex: 1;
  background: rgba(143, 107, 175, 0.42);
}

.memory-card p {
  margin: 13px auto 17px;
  color: #5d5165;
  font-size: 0.92rem;
  line-height: 1.5;
}

.share-button,
.gallery-button {
  width: 100%;
  min-height: 53px;
  font-size: 0.93rem;
  font-weight: 700;
}

.share-button {
  background: #8f6baf;
  box-shadow: 0 9px 17px rgba(98, 66, 122, 0.22);
  color: white;
}

.completed-button {
  margin-bottom: 10px;
  background: rgba(130, 103, 149, 0.22);
  box-shadow: none;
  color: #7f6d89;
}

.gallery-button {
  background: #8f6baf;
  box-shadow: 0 9px 17px rgba(98, 66, 122, 0.22);
  color: white;
}

.sparkle {
  position: absolute;
  color: rgba(255, 255, 255, 0.82);
}

.sparkle-one {
  top: 39px;
  left: 27px;
  font-size: 1.35rem;
}

.sparkle-two {
  top: 72px;
  right: 31px;
  font-size: 0.96rem;
}

.progress-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border: 1px solid #eee7f1;
  border-radius: 21px;
  background: white;
  box-shadow: 0 10px 24px rgba(73, 54, 86, 0.07);
}

.progress-icon {
  display: grid;
  width: 43px;
  height: 43px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #f1e8f7;
  color: #8f6baf;
}

.progress-content {
  min-width: 0;
  flex: 1;
}

.progress-label {
  margin-bottom: 8px;
  color: #4f425f;
  font-size: 0.86rem;
  font-weight: 600;
}

@media (max-height: 700px) {
  .home-tab {
    padding-top: 16px;
  }

  .content {
    gap: 12px;
    padding-top: 18px;
  }

  .memory-card {
    padding: 18px 20px;
  }

  .monogram-circle {
    width: 59px;
    height: 59px;
    margin-bottom: 10px;
  }

  .memory-card p {
    margin: 9px auto 13px;
  }
}

.monogram {
  color: #8f6baf;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.38rem;
  font-weight: 700;
  letter-spacing: -0.08em;
}

.monogram span {
  display: inline-block;
  margin: 0 2px;
  font-size: 0.78rem;
  vertical-align: middle;
}
</style>
