<template>

  <Transition name="loader">

    <div
      v-if="viewer.loading"
      class="loader"
    >

      <div class="camera">

        📸

      </div>

      <div class="title">

        Preparing this memory...

      </div>

      <div class="subtitle">

        Loading high quality photo

      </div>

      <q-linear-progress
        indeterminate
        rounded
        color="white"
        class="progress"
      />

    </div>

  </Transition>

</template>

<script setup lang="ts">

import {
  useMomentsViewerStore,
} from "@/stores/moments-viewer-store";

const viewer =
  useMomentsViewerStore();

</script>

<style scoped>

.loader{

  position:absolute;

  inset:0;

  z-index:15;

  background:rgba(0,0,0,.35);

  backdrop-filter:blur(20px);

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

}

.camera{

  font-size:56px;

  animation:float 2.5s ease-in-out infinite;

}

.title{

  margin-top:24px;

  color:white;

  font-size:1.15rem;

  font-weight:600;

}

.subtitle{

  margin-top:6px;

  color:rgba(255,255,255,.75);

  font-size:.85rem;

}

.progress{

  width:220px;

  margin-top:28px;

}

.loader-enter-active,
.loader-leave-active{

  transition:opacity .25s;

}

.loader-enter-from,
.loader-leave-to{

  opacity:0;

}

@keyframes float{

  0%{

    transform:translateY(0);

  }

  50%{

    transform:translateY(-8px);

  }

  100%{

    transform:translateY(0);

  }

}

</style>
