<template>
  <Transition name="fade">
    <div
      v-if="app.loading"
      class="splash"
    >
      <div class="top-wash" />

      <div class="content">
        <div class="monogram-frame">
          <WeddingMonogram :size="104" />
        </div>

        <p class="welcome-label">
          WELCOME TO
        </p>

        <h1>
          Daniele <span>&</span> Kath
        </h1>

        <div class="title-divider">
          <span />
          <q-icon
            name="favorite"
            size="17px"
          />
          <span />
        </div>

        <p class="tagline">
          Wedding Photo Gallery
        </p>

        <div class="loading-area">
          <p class="message">
            {{ app.message }}
          </p>

          <q-linear-progress
            rounded
            size="8px"
            color="primary"
            track-color="grey-3"
            :value="app.progress / 100"
            class="progress"
          />

          <p class="percent">
            {{ app.progress }}%
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app-store";

import WeddingMonogram
  from "@/components/shared/WeddingMonogram.vue";

const app = useAppStore();
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding:
    calc(env(safe-area-inset-top) + 24px)
    28px
    calc(env(safe-area-inset-bottom) + 30px);
  background:
    radial-gradient(
      circle at 50% 38%,
      #ffffff 0%,
      #fcfafd 55%,
      #f3eaf8 100%
    );
}

.top-wash {
  position: absolute;
  top: -100px;
  left: -80px;
  width: 290px;
  height: 290px;
  border-radius: 50%;
  background: rgba(218, 194, 234, 0.42);
  filter: blur(28px);
}

.content {
  position: relative;
  width: min(300px, 100%);
  text-align: center;
}

.monogram-frame {
  display: grid;
  width: 142px;
  height: 142px;
  margin: 0 auto 29px;
  place-items: center;
  border: 2px solid rgba(143, 107, 175, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.62);
  box-shadow:
    0 16px 38px rgba(93, 66, 111, 0.15),
    inset 0 0 0 8px rgba(240, 229, 247, 0.7);
}

.welcome-label {
  margin: 0 0 10px;
  color: #9576a7;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
}

h1 {
  margin: 0;
  color: #4b3156;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(3.2rem, 14vw, 4.6rem);
  font-weight: 500;
  line-height: 0.9;
}

h1 span {
  color: #a27abc;
  font-size: 0.72em;
  font-style: italic;
}

.title-divider {
  display: flex;
  width: 158px;
  align-items: center;
  gap: 10px;
  margin: 22px auto 16px;
  color: #bd9a62;
}

.title-divider span {
  height: 1px;
  flex: 1;
  background: #d4b987;
}

.tagline {
  margin: 0;
  color: #5c4369;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.7rem;
}

.loading-area {
  margin-top: 56px;
}

.message {
  margin: 0;
  color: #6e5b77;
  font-size: 0.86rem;
}

.progress {
  margin-top: 16px;
}

.percent {
  margin: 10px 0 0;
  color: #9576a7;
  font-size: 0.78rem;
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
