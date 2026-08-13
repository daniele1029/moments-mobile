<template>

  <div
    v-if="modelValue"
    class="overlay"
  >

    <q-card class="card">

      <div class="icon">

        <q-icon
          name="qr_code_2"
          size="72px"
        />

      </div>

      <h2>

        Invitation Not Found

      </h2>

      <p class="message">

        We couldn't verify your invitation.

        <br>

        Please scan your QR code again.

      </p>

      <q-btn

        unelevated

        rounded

        no-caps

        color="primary"

        class="button"

        label="Scan Again"

        @click="scanAgain"

      />

    </q-card>

  </div>

</template>

<script setup lang="ts">

const {
  modelValue,
} = defineProps<{
  modelValue: boolean;
}>();

const emit =
  defineEmits<{

    (
      e:"update:modelValue",
      value:boolean,
    ):void;

    (
      e:"scan-again",
    ):void;

  }>();

function scanAgain() {

  emit(
    "update:modelValue",
    false,
  );

  emit(
    "scan-again",
  );

}

</script>

<style scoped>

.card{

  width:340px;

  border-radius:28px;

  padding:36px 28px;

  text-align:center;

}

.icon{

  color:#9B6BCB;

}

h2{

  margin-top:24px;

  margin-bottom:16px;

  font-family:
    "Cormorant Garamond",
    serif;

  font-size:2rem;

  color:#4F3D64;

}

.message{

  line-height:1.8;

  color:#777;

}

.button{

  width:100%;

  margin-top:28px;

  height:54px;

}

.overlay{

  position:fixed;

  inset:0;

  z-index:200000;

  display:flex;

  justify-content:center;

  align-items:center;

  background:rgba(0,0,0,.45);

  backdrop-filter:blur(8px);

}

</style>
