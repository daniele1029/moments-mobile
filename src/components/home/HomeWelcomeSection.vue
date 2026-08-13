<template>

  <section class="welcome">

    <div class="monogram">

      <!-- Replace this with your SVG later -->

      <q-icon
        name="favorite"
        size="72px"
      />

    </div>

    <h1>

      {{ settings?.brideName }}

      <span>&</span>

      {{ settings?.groomName }}

    </h1>

    <div class="date">

      {{ formattedDate }}

    </div>

    <div class="divider" />

    <div class="label">

      Welcome

    </div>

    <h2>

      Thank You For
      <br>
      Celebrating With Us

    </h2>

    <p>

      Every photo you share becomes
      part of our wedding story.

    </p>

  </section>

</template>

<script setup lang="ts">

import { computed } from "vue";

import { useSettingsStore }
  from "@/stores/settings-store";

const settingsStore =
  useSettingsStore();

const settings =
  computed(
    () => settingsStore.settings,
  );

const formattedDate =
  computed(() => {

    if (
      !settings.value?.weddingDate
    ) {

      return "";

    }

    return new Date(
      settings.value.weddingDate,
    ).toLocaleDateString(
      "en-US",
      {

        month: "long",

        day: "numeric",

        year: "numeric",

      },
    );

  });

</script>

<style scoped>

.welcome{

  padding:56px 28px 24px;

  text-align:center;

}

.monogram{

  width:120px;

  height:120px;

  margin:auto;

  border-radius:999px;

  display:flex;

  justify-content:center;

  align-items:center;

  background:#F4EEF8;

  color:#8F6BAF;

}

h1{

  margin-top:28px;

  margin-bottom:0;

  line-height:1.15;

  color:#4F425F;

  font-size:3rem;

  font-family:
    "Cormorant Garamond",
    serif;

}

h1 span{

  display:block;

  margin:10px 0;

  color:#8F6BAF;

  font-size:2rem;

}

.date{

  margin-top:20px;

  color:#9B7CC0;

  text-transform:uppercase;

  letter-spacing:4px;

  font-size:.9rem;

}

.divider{

  width:72px;

  height:1px;

  margin:40px auto;

  background:#DDD4E6;

}

.label{

  margin-bottom:16px;

  color:#9B7CC0;

  text-transform:uppercase;

  letter-spacing:4px;

  font-size:.8rem;

}

h2{

  margin:0;

  line-height:1.2;

  color:#4F425F;

  font-size:2.6rem;

  font-family:
    "Cormorant Garamond",
    serif;

}

p{

  max-width:320px;

  margin:22px auto 0;

  color:#78727F;

  line-height:1.9;

  font-size:1rem;

}

</style>
