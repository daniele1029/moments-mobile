<template>
  <Transition
    name="authentication-fade"
    appear
  >
    <div
      v-if="ui.authenticationOpen"
      class="authentication-overlay"
    >
      <div class="overlay-backdrop" />

      <q-card
        flat
        class="authentication-card"
      >
        <!-- Logo -->

        <div class="logo">
          <WeddingMonogram :size="68" />
        </div>

        <!-- Title -->

        <h1>

          Welcome

        </h1>

        <p class="subtitle">

          We're delighted you're here.

          <br>

          Please verify your invitation

          to join our wedding celebration.

        </p>

        <!-- Scan QR -->

        <q-btn
          unelevated
          rounded
          no-caps
          color="primary"
          icon="qr_code_scanner"
          class="action-button"
          label="Scan Invitation QR"
          @click="scannerOpen = true"
        />

        <div class="divider">

          <span>OR</span>

        </div>

        <!-- NFC -->

        <q-btn
          outline
          rounded
          no-caps
          color="primary"
          icon="contactless"
          class="action-button"
          label="Tap NFC Invitation"
          @click="scanNfc"
        />

        <div class="footer">

          Only invited guests can access

          this wedding experience.

        </div>

      </q-card>

      <!-- QR Scanner -->

      <QrScannerOverlay
        v-model="scannerOpen"
        @detected="authenticate"
      />

      <LoadingOverlay
        :model-value="loadingOpen"
        title="Verifying your invitation..."
        message="Please wait while we prepare your Moments experience."
      />

      <AuthenticationErrorDialog
        v-model="errorOpen"
        @scan-again="scannerOpen = true"
      />

    </div>

  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useUIStore } from "@/stores/ui-store";
import QrScannerOverlay from "./QrScannerOverlay.vue";
import authService from "@/services/auth.service";
import AuthenticationErrorDialog from "./AuthenticationErrorOverlay.vue";
import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
import WeddingMonogram from "@/components/shared/WeddingMonogram.vue";
import { useAuthStore } from "@/stores/auth-store";
const ui = useUIStore();
const auth = useAuthStore();

const scannerOpen = ref(false);
const loadingOpen = ref(false);
const errorOpen = ref(false);

onMounted(() => {
  if (auth.authenticated) return;
  const params = new URLSearchParams(window.location.search);
  const cardUuid = params.get("card");
  if (!cardUuid) return;
  loadingOpen.value = true;
  void authenticate(cardUuid)
});

function normalizeQrCode(value: string,): string {
  try {
    const url = new URL(value);
    const card = url.searchParams.get("card");
    if (card) return card;
  } catch {
    // Not a URL, fall through
  }
  return value.trim();
}

async function authenticate(qrCode: string) {
  loadingOpen.value = true;
  try {
    const cardUuid = normalizeQrCode(qrCode,);

    console.log(
      "Normalized:",
      cardUuid,
    );

    const guest = await authService.login(cardUuid);
    auth.startSession(guest);

    window.history.replaceState(
      {},
      "",
      window.location.pathname,
    );
    Notify.create({
      type: "positive",
      message: `Welcome ${guest.fullName}!`,
    });
    ui.closeAuthentication();
  }
  catch (error) {
    console.error(
      "❌ Login failed:",
      error,
    );

    errorOpen.value = true;

    console.log(
      "errorOpen:",
      errorOpen.value,
    );

  }
}

function scanNfc() {

  Notify.create({

    type:"info",

    message:
      "NFC coming soon.",

  });

}
</script>

<style scoped>

.authentication-overlay{

  position:fixed;

  inset:0;

  z-index:99999;

  display:flex;

  justify-content:center;

  align-items:center;

  padding:
    calc(env(safe-area-inset-top) + 24px)
    24px
    calc(env(safe-area-inset-bottom) + 24px);

}

.overlay-backdrop{

  position:absolute;

  inset:0;

  background:
    rgba(255,255,255,.18);

  backdrop-filter:
    blur(18px)
    saturate(170%);

}

.authentication-card{

  position:relative;

  width:100%;

  max-width:420px;

  padding:36px 28px;

  border-radius:32px;

  background:
    rgba(255,255,255,.92);

  box-shadow:
    0 20px 70px rgba(0,0,0,.16);

}

.logo{

  width:84px;

  height:84px;

  margin:auto;

  border-radius:999px;

  display:flex;

  align-items:center;

  justify-content:center;

  background:#F4EDFB;

  color:#8F6BAF;

}

h1{

  margin-top:28px;

  margin-bottom:12px;

  text-align:center;

  font-family:
    "Cormorant Garamond",
    serif;

  font-size:3rem;

  color:#5B4972;

}

.subtitle{

  text-align:center;

  line-height:1.8;

  color:#777;

  margin-bottom:30px;

}

.action-button{

  width:100%;

  height:60px;

}

.divider{

  display:flex;

  align-items:center;

  margin:24px 0;

}

.divider::before,

.divider::after{

  content:"";

  flex:1;

  height:1px;

  background:#E6E6E6;

}

.divider span{

  padding:0 18px;

  color:#AAA;

}

.footer{

  margin-top:30px;

  text-align:center;

  color:#999;

  font-size:.82rem;

  line-height:1.7;

}

.authentication-fade-enter-active,

.authentication-fade-leave-active{

  transition:
    opacity .3s;

}

.authentication-fade-enter-from,

.authentication-fade-leave-to{

  opacity:0;

}

@media (max-width:420px){

  .authentication-card{

    padding:30px 22px;

  }

  h1{

    font-size:2.5rem;

  }

}

</style>
