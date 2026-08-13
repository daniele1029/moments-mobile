<template>
  <router-view />

  <AuthenticationOverlay />

  <Transition
    name="splash-fade"
  >
    <SplashScreen
      v-if="app.loading"
    />
  </Transition>
</template>

<script setup lang="ts">
import AuthenticationOverlay
  from "@/components/authentication/AuthenticationOverlay.vue";

import SplashScreen
  from "@/components/SplashScreen.vue";

import {
  useAppStore,
} from "@/stores/app-store";

const app =
  useAppStore();
</script>

<style>
.splash-fade-leave-active {
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
