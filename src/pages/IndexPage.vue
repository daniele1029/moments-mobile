<template>

  <q-page class="page">
    <q-tab-panels
      v-model="ui.currentTab"
      animated
      swipeable
      class="panels"
    >

      <!-- GALLERY -->

      <q-tab-panel
        :name="HomeTab.GALLERY"
        class="panel"
      >

        <GalleryTab />

      </q-tab-panel>

      <!-- HOME -->

      <q-tab-panel
        :name="HomeTab.HOME"
        class="panel"
      >

        <HomeTabContent />

      </q-tab-panel>

      <!-- MY UPLOADS -->

      <q-tab-panel
        :name="HomeTab.MY_UPLOADS"
        class="panel"
      >
        <MyUploadsTab />
      </q-tab-panel>

    </q-tab-panels>

    <!-- Navigation -->

    <BottomNavigation />

    <!-- Overlays -->

    <AuthenticationOverlay />

    <UploadSheet />

    <MomentsViewer />

    <CameraOverlay />

  </q-page>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, } from "vue";
import { HomeTab, useUIStore } from "@/stores/ui-store";
import { useMomentsViewerStore } from "@/stores/moments-viewer-store";
import BootstrapService from "@/services/bootstrap.service";
import BottomNavigation from "@/components/navigation/BottomNavigation.vue";
import AuthenticationOverlay from "@/components/authentication/AuthenticationOverlay.vue";
import UploadSheet from "@/components/modals/UploadSheet.vue";
import MomentsViewer from "@/components/moments-viewer/MomentsViewer.vue";
import CameraOverlay from "@/components/camera/CameraOverlay.vue";
import GalleryTab from "@/components/tabs/GalleryTab.vue";
import MyUploadsTab from "@/components/tabs/MyUploadsTab.vue";
import HomeTabContent from "@/components/tabs/HomeTab.vue";
const ui = useUIStore();
const viewer = useMomentsViewerStore();
function handleAppBack() {

  if (ui.photoPreviewOpen) {
    ui.closePhotoPreview();
    ui.openCamera();
    return;
  }

  if (viewer.actionSheetOpen) {
    viewer.hideActionSheet();
    return;
  }

  if (viewer.actionSheetOpen) {
    viewer.hideActionSheet();
    return;
  }

  if (viewer.opened) {
    viewer.close();
    return;
  }

  if (ui.cameraOpen) {
    ui.closeCamera();
    return;
  }

  if (ui.uploadOpen) {
    ui.closeUpload();
    return;
  }

  if (ui.currentTab !== HomeTab.HOME) {
    ui.goHome();
    return;
  }
}

function onBrowserBack() {
  /*
   * Re-arm the single-page-app history guard first.
   * This must happen before mounting another q-dialog.
   */
  window.history.pushState(
    { momentsApp: true },
    "",
    window.location.href,
  );

  handleAppBack();
}

onMounted(() => {
  /*
   * Create a history entry the browser can return to when the
   * Android Back button or iOS back gesture is used.
   */
  window.history.replaceState(
    { momentsApp: true },
    "",
    window.location.href,
  );

  window.history.pushState(
    { momentsApp: true },
    "",
    window.location.href,
  );

  window.addEventListener(
    "popstate",
    onBrowserBack,
  );

  void BootstrapService.initialize();
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "popstate",
    onBrowserBack,
  );
});
</script>

<style scoped>

.page{

  background:#FCFAFD;

}

.panels {
  background: transparent;
  padding-bottom: 132px;
}

.panel{

  padding:0;

}

.placeholder{

  min-height:70vh;

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  text-align:center;

  color:#8F6BAF;

}

.placeholder h2{

  margin-top:24px;

  margin-bottom:12px;

  font-family:
    "Cormorant Garamond",
    serif;

  font-size:2.4rem;

}

.placeholder p{

  color:#888;

}

</style>
