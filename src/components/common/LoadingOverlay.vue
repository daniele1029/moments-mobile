<template>

  <div
    v-if="modelValue"
    class="overlay"
  >

    <div class="card">

      <q-spinner-dots
        color="primary"
        size="64px"
      />

      <h2>

        {{ title }}

      </h2>

      <p>

        {{ message }}

      </p>

    </div>

  </div>

</template>

<script setup lang="ts">

const {
  modelValue,
  title,
  message,
} = defineProps<{

  modelValue:boolean;

  title:string;

  message:string;

}>();

</script>

<style scoped>

.overlay{

  position:fixed;

  inset:0;

  z-index:300000;

  display:flex;

  justify-content:center;

  align-items:center;

  background:rgba(255,255,255,.85);

  backdrop-filter:blur(12px);

}

.card{

  text-align:center;

}

h2{

  margin-top:28px;

  margin-bottom:12px;

  font-size:2rem;

  font-family:
    "Cormorant Garamond",
    serif;

  color:#5A4A6A;

}

p{

  color:#777;

  line-height:1.8;

}

</style>
