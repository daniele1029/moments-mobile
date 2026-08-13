<template>

  <section class="getting-started">

    <template v-if="auth.remainingUploads > 0">

      <div class="divider" />

      <div class="label">

        Getting Started

      </div>

      <h2>

        How to Use Moments

      </h2>

      <p class="intro">

        Capture, share, and relive the beautiful
        memories from our special day.

      </p>

      <div class="steps">

        <q-card
          flat
          class="step-card"
        >

          <div class="icon">

            <q-icon
              name="photo_camera"
              size="30px"
            />

          </div>

          <div class="content">

            <h3>

              Upload Memories

            </h3>

            <p>

              Tap the floating camera button below
              to upload your favorite wedding
              moments.

            </p>

          </div>

        </q-card>

        <q-card
          flat
          class="step-card"
        >

          <div class="icon">

            <q-icon
              name="photo_library"
              size="30px"
            />

          </div>

          <div class="content">

            <h3>

              Browse Gallery

            </h3>

            <p>

              Explore the beautiful memories shared
              by everyone throughout the celebration.

            </p>

          </div>

        </q-card>

        <q-card
          flat
          class="step-card"
        >

          <div class="icon">

            <q-icon
              name="collections"
              size="30px"
            />

          </div>

          <div class="content">

            <h3>

              My Uploads

            </h3>

            <p>

              View all the memories you've uploaded
              in one convenient place.

            </p>

          </div>

        </q-card>

      </div>

    </template>

    <template v-else>

      <div class="completed">

        <div class="heart">

          ❤️

        </div>

        <div class="label">

          Thank You

        </div>

        <h2>

          Memories Complete

        </h2>

        <p class="intro">

          You've shared all of your wedding memories.

          <br><br>

          Every smile, laugh, and heartfelt moment
          you've captured is now part of our wedding
          story.

        </p>

        <q-card
          flat
          class="completed-card"
        >

          <q-icon
            name="favorite"
            size="42px"
            color="primary"
          />

          <div class="completed-title">

            Your Upload Journey is Complete

          </div>

          <div class="completed-text">

            Thank you for helping us preserve one of
            the most meaningful days of our lives.

          </div>

        </q-card>

        <div class="actions">

          <q-btn
            color="primary"
            rounded
            unelevated
            no-caps
            icon="photo_library"
            label="Browse Gallery"
            class="full-width"
            @click="ui.goGallery()"
          />

          <q-btn
            flat
            rounded
            no-caps
            icon="collections"
            label="View My Uploads"
            class="full-width q-mt-md"
            @click="ui.goMyUploads()"
          />

        </div>

      </div>

    </template>

  </section>

</template>

<script setup lang="ts">

import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

const auth =
  useAuthStore();

const ui =
  useUIStore();

</script>

<style scoped>

.getting-started{

  padding:0 24px 120px;

}

.divider{

  width:72px;

  height:1px;

  background:#DDD4E6;

  margin:0 auto 40px;

}

.label{

  text-align:center;

  text-transform:uppercase;

  letter-spacing:4px;

  color:#9B7CC0;

  font-size:.8rem;

}

h2{

  margin:16px 0;

  text-align:center;

  font-family:
    "Cormorant Garamond",
    serif;

  font-size:2.5rem;

  color:#4F425F;

}

.intro{

  text-align:center;

  max-width:340px;

  margin:0 auto 36px;

  line-height:1.8;

  color:#7B7485;

}

.steps{

  display:flex;

  flex-direction:column;

  gap:18px;

}

.step-card{

  display:flex;

  align-items:flex-start;

  gap:18px;

  padding:22px;

  border-radius:22px;

  background:#FCFAFD;

  border:1px solid #EFE7F5;

}

.icon{

  width:52px;

  height:52px;

  border-radius:50%;

  display:flex;

  justify-content:center;

  align-items:center;

  background:#F3EDF8;

  color:#8F6BAF;

  flex-shrink:0;

}

.content{

  flex:1;

}

.content h3{

  margin:0;

  font-size:1.1rem;

  color:#4F425F;

}

.content p{

  margin-top:8px;

  color:#777;

  line-height:1.7;

}

/* Completed State */

.completed{

  text-align:center;

}

.heart{

  font-size:4rem;

  margin-bottom:16px;

}

.completed-card{

  margin:36px 0;

  padding:32px 24px;

  border-radius:28px;

  background:linear-gradient(
    180deg,
    #FCFAFD,
    #F6F0FB
  );

  border:1px solid #EADDF5;

}

.completed-title{

  margin-top:20px;

  font-size:1.25rem;

  font-weight:600;

  color:#4F425F;

}

.completed-text{

  margin-top:12px;

  line-height:1.8;

  color:#7B7485;

}

.actions{

  margin-top:12px;

}

</style>
