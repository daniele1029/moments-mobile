import { defineStore } from "pinia";

export enum HomeTab {

  HOME = "home",

  GALLERY = "gallery",

  MY_UPLOADS = "my-uploads",

}

export const useUIStore = defineStore("ui", {

  state: () => ({

    splash: true,

    currentTab: HomeTab.HOME,

    authenticationOpen: false,

    uploadOpen: false,

    photoViewerOpen: false,

    photoPreviewOpen: false,

    cameraOpen:false,

  }),

  actions: {

    openPhotoPreview() {
      this.photoPreviewOpen = true;
    },

    closePhotoPreview() {
      this.photoPreviewOpen = false;
    },

    hideSplash() {
      this.splash = false;
    },

    openAuthentication() {
      this.authenticationOpen = true;
    },

    closeAuthentication() {
      this.authenticationOpen = false;
    },

    toggleAuthentication() {
      this.authenticationOpen = !this.authenticationOpen;
    },

    openUpload() {
      this.uploadOpen = true;
    },

    closeUpload() {
      this.uploadOpen = false;
    },

    goHome() {

      this.currentTab =
        HomeTab.HOME;

    },

    goGallery() {

      this.currentTab =
        HomeTab.GALLERY;

    },

    goMyUploads() {

      this.currentTab =
        HomeTab.MY_UPLOADS;

    },

    openCamera(){

      this.cameraOpen=true;

    },

    closeCamera(){

      this.cameraOpen=false;

    },

  },

});
