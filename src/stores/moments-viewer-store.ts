import { defineStore } from "pinia";

export interface MomentPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  guestName?: string;
  uploadedAt?: string
  caption: string | null;
}

interface OpenPayload {
  photos: MomentPhoto[];
  index: number;
  element: HTMLElement;
  canDelete?: boolean;
}

interface ViewerState {
  opened: boolean;
  loading: boolean;
  animating: boolean;
  toolbarVisible: boolean;
  actionSheetOpen: boolean;
  isZoomed: boolean;
  dismissOffset: number;
  photos: MomentPhoto[];
  currentIndex: number;
  sourceElement: HTMLElement | null;
  canDelete: boolean;
}

export const useMomentsViewerStore = defineStore(
  "moments-viewer",
  {

    state: (): ViewerState => ({
      opened: false,
      loading: false,
      animating: false,
      toolbarVisible: true,
      actionSheetOpen: false,
      isZoomed: false,
      dismissOffset: 0,
      photos: [],
      currentIndex: 0,
      sourceElement: null,
      canDelete: false,
    }),

    getters: {

      currentPhoto(state): MomentPhoto | null {

        return (
          state.photos[state.currentIndex] ??
          null
        );

      },

      previousPhoto(state): MomentPhoto | null {

        if (state.currentIndex <= 0) {

          return null;

        }

        return (
          state.photos[state.currentIndex - 1] ??
          null
        );

      },

      nextPhoto(state): MomentPhoto | null {

        if (
          state.currentIndex >=
          state.photos.length - 1
        ) {

          return null;

        }

        return (
          state.photos[state.currentIndex + 1] ??
          null
        );

      },

      total(state): number {

        return state.photos.length;

      },

      hasNext(state): boolean {

        return (
          state.currentIndex <
          state.photos.length - 1
        );

      },

      hasPrevious(state): boolean {

        return state.currentIndex > 0;

      },

    },

    actions: {

      open(payload: OpenPayload) {
        this.photos = payload.photos;
        this.currentIndex = payload.index;
        this.sourceElement = payload.element;
        this.loading = true;
        this.animating = true;
        this.toolbarVisible = true;
        this.isZoomed = false;
        this.opened = true;
        this.canDelete = payload.canDelete ?? false;
      },

      beginClose() {
        this.animating = true;
      },

      close() {
        this.opened = false;
        this.loading = false;
        this.animating = false;
        this.toolbarVisible = true;
        this.actionSheetOpen = false;
        this.isZoomed = false;
        this.photos = [];
        this.currentIndex = 0;
        this.sourceElement = null;
        this.canDelete = false;
      },

      finishLoading() {

        this.loading = false;

      },

      startLoading() {

        this.loading = true;

      },

      finishAnimation() {

        this.animating = false;

      },

      showToolbar() {

        this.toolbarVisible = true;

      },

      hideToolbar() {

        this.toolbarVisible = false;

      },

      toggleToolbar() {
        this.toolbarVisible = !this.toolbarVisible;
      },

      showActionSheet() {

        this.actionSheetOpen = true;

      },

      hideActionSheet() {

        this.actionSheetOpen = false;

      },

      toggleActionSheet() {

        this.actionSheetOpen =
          !this.actionSheetOpen;

      },

      setDismissOffset(value: number) {
        this.dismissOffset = value;
      },

      resetDismissOffset() {
        this.dismissOffset = 0;
      },

      setZoomed(value: boolean) {
        this.isZoomed = value;
      },

      next() {

        if (!this.hasNext) {
          return;
        }

        this.loading = true;

        this.currentIndex++;

      },

      previous() {

        if (!this.hasPrevious) {
          return;
        }

        this.loading = true;

        this.currentIndex--;

      },

      goTo(index: number) {

        if (
          index < 0 ||
          index >= this.photos.length
        ) {
          return;
        }

        this.loading = true;

        this.currentIndex = index;

      },

    },

  },
);
