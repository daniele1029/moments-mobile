<template>
  <Transition
    name="scanner-fade"
    appear
  >
    <div
      v-if="modelValue"
      class="scanner-overlay"
    >
      <!-- Header -->

      <header class="scanner-header">

        <q-btn
          flat
          round
          dense
          color="white"
          icon="close"
          @click="close"
        />

        <div class="title">

          Scan Invitation QR

        </div>

        <div class="placeholder" />

      </header>

      <!-- Scanner -->

      <main class="scanner-body">

        <div class="scanner-container">

          <div
            id="qr-reader"
            class="scanner"
          />

          <!-- Scan Frame -->

          <div class="scan-frame">

            <div class="corner top-left" />

            <div class="corner top-right" />

            <div class="corner bottom-left" />

            <div class="corner bottom-right" />

          </div>

        </div>

        <p class="instruction">

          Align your invitation QR inside
          the frame.

        </p>

      </main>

    </div>

  </Transition>
</template>

<script setup lang="ts">
import {
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";

import qrCodeService
  from "@/services/qr-code.service";

const props =
  defineProps<{

    modelValue:boolean;

  }>();

const emit =
  defineEmits<{

    (
      e:"update:modelValue",
      value:boolean,
    ):void;

    (
      e:"detected",
      value:string,
    ):void;

  }>();

watch(

  () => props.modelValue,

  async (open) => {

    if (open) {

      await nextTick();

      await qrCodeService.start(
        "qr-reader",
        (value) => {
          void handleDetected(value);
        },
      );
    }
    else {
      await qrCodeService.stop();
    }
  },
  {
    immediate:true,
  },

);

async function handleDetected(
  value: string,
) {

  console.log(
    "📷 QR Detected:",
    value,
  );

  emit(
    "detected",
    value,
  );

  emit(
    "update:modelValue",
    false,
  );

  await qrCodeService.stop();

}

async function close() {

  await qrCodeService.stop();

  emit(
    "update:modelValue",
    false,
  );

}

onBeforeUnmount(

  async () => {

    await qrCodeService.stop();

  },

);
</script>

<style scoped>

.scanner-overlay{

  position:fixed;

  inset:0;

  z-index:100000;

  background:black;

  display:flex;

  flex-direction:column;

}

.scanner-header{

  height:72px;

  padding:0 20px;

  display:flex;

  align-items:center;

  justify-content:space-between;

  color:white;

}

.title{

  font-size:1rem;

  font-weight:600;

}

.placeholder{

  width:40px;

}

.scanner-body{

  flex:1;

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  padding:24px;

}

.scanner-container{

  position:relative;

  width:100%;

  max-width:340px;

}
.scanner{

  width:100%;

  max-width:340px;

  height:340px;

  overflow:hidden;

}

.scan-frame{

  position:absolute;

  inset:0;

  pointer-events:none;

}

.corner{

  position:absolute;

  width:34px;

  height:34px;

  border-color:white;

  border-style:solid;

}

.top-left{

  top:0;

  left:0;

  border-width:4px 0 0 4px;

  border-top-left-radius:12px;

}

.top-right{

  top:0;

  right:0;

  border-width:4px 4px 0 0;

  border-top-right-radius:12px;

}

.bottom-left{

  bottom:0;

  left:0;

  border-width:0 0 4px 4px;

  border-bottom-left-radius:12px;

}

.bottom-right{

  bottom:0;

  right:0;

  border-width:0 4px 4px 0;

  border-bottom-right-radius:12px;

}

.instruction{

  margin-top:32px;

  color:white;

  opacity:.85;

  text-align:center;

  line-height:1.7;

}

.scanner-fade-enter-active,

.scanner-fade-leave-active{

  transition:
    opacity .25s;

}

.scanner-fade-enter-from,

.scanner-fade-leave-to{

  opacity:0;

}

/* Remove html5-qrcode UI */

:deep(#qr-reader){

  border:none!important;

  background:transparent!important;

}

:deep(#qr-reader__dashboard){

  display:none!important;

}

:deep(#qr-reader__scan_region){

  border:none!important;

}

:deep(video){

  width:100%!important;

  border-radius:20px;

  object-fit:cover;

}

</style>
