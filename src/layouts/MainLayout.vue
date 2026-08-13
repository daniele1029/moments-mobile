<template>

  <q-layout
    view="hHh lpR fFf"
    class="bg-background"
  >

    <q-page-container>

      <router-view />

    </q-page-container>

  </q-layout>

</template>

<script setup lang="ts">
defineOptions({
  name: "MainLayout",
});
</script>

<style scoped>

.q-layout {
  min-height: 100vh;
  background: #F8F5FB;
}

</style>
