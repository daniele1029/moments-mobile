<template>

  <Transition name="toolbar">

    <div
      v-show="visible && !viewer.isZoomed"
      class="toolbar"
    >

      <q-btn
        flat
        round
        dense
        color="white"
        icon="close"
        class="toolbar-button"
        @click.stop="viewer.close()"
      />

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { useMomentsViewerStore, } from "@/stores/moments-viewer-store";
const viewer = useMomentsViewerStore();

let timeout: number | undefined;
const visible = computed(() => viewer.toolbarVisible);

function scheduleHide(){

  clearTimeout(timeout);

  timeout =
    window.setTimeout(()=>{

      viewer.hideToolbar();

    },2500);

}

watch(

  ()=>viewer.opened,

  (open)=>{

    if(!open){

      clearTimeout(timeout);

      return;

    }

    viewer.showToolbar();

    scheduleHide();

  },

  { immediate:true }

);

watch(

  ()=>viewer.currentIndex,

  ()=>{

    viewer.showToolbar();

    scheduleHide();

  }

);

onBeforeUnmount(()=>{

  clearTimeout(timeout);

});

</script>

<style scoped>

.toolbar{

  position:absolute;

  top:0;

  left:0;

  right:0;

  padding:

    calc(env(safe-area-inset-top) + 12px)

    16px

    12px;

  display:flex;

  justify-content:flex-start;

  align-items:center;

  z-index:50;

  pointer-events:auto;

}

.toolbar-button{

  background:rgba(255,255,255,.14);

  backdrop-filter:blur(18px);

}

.counter{

  pointer-events:auto;

  padding:10px 18px;

  border-radius:999px;

  background:rgba(255,255,255,.14);

  backdrop-filter:blur(18px);

  color:white;

  font-weight:600;

}

.counter span{

  opacity:.7;

}

.toolbar-enter-active,

.toolbar-leave-active{

  transition:

    opacity .25s,

    transform .25s;

}

.toolbar-enter-from,

.toolbar-leave-to{

  opacity:0;

  transform:translateY(-18px);

}

.actions-sheet{

  border-top-left-radius:24px;

  border-top-right-radius:24px;

  padding-bottom:env(safe-area-inset-bottom);

}
</style>
