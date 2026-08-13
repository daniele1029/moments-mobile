import { defineStore } from "pinia";
import { ref } from "vue";

import galleryService, {
  type GalleryPhoto,
} from "@/services/gallery.service";

export const useGalleryStore =
  defineStore(
    "gallery",
    () => {

      const gallery =
        ref<GalleryPhoto[]>([]);

      const myGallery =
        ref<GalleryPhoto[]>([]);

      const loading = ref(false);
      const myGalleryLoading = ref(false);
      const loadingMore = ref(false);
      const nextCursor = ref<string | null>(null);
      const hasMore = ref(true);

      async function fetchGallery() {
        if (loading.value) {
          return;
        }

        loading.value = true;

        try {
          const page =
            await galleryService.getGallery();

          gallery.value =
            page.photos;

          nextCursor.value =
            page.nextCursor;

          hasMore.value =
            page.hasMore &&
            page.nextCursor !== null;
        }
        finally {
          loading.value = false;
        }
      }

      async function loadMore() {
        const cursor =
          nextCursor.value;

        if (
          loading.value ||
          loadingMore.value ||
          !hasMore.value ||
          !cursor
        ) {
          return;
        }

        loadingMore.value = true;

        try {
          const page =
            await galleryService.getGallery(
              cursor,
            );

          const loadedIds =
            new Set(
              gallery.value.map(
                (photo) => photo.id,
              ),
            );

          const newPhotos =
            page.photos.filter(
              (photo) =>
                !loadedIds.has(photo.id),
            );

          gallery.value.push(
            ...newPhotos,
          );

          nextCursor.value =
            page.nextCursor;

          hasMore.value =
            page.hasMore &&
            page.nextCursor !== null;
        }
        finally {
          loadingMore.value = false;
        }
      }

      async function refreshGallery() {

        nextCursor.value = null;

        hasMore.value = true;

        await fetchGallery();

      }

      async function fetchMyGallery() {
        myGalleryLoading.value = true;
        try {
          myGallery.value = await galleryService.getMyGallery();
        } finally {
          myGalleryLoading.value = false;
        }
      }

      async function deleteMyPhoto(
        photoId: string,
      ) {
        await galleryService.deletePhoto(
          photoId,
        );

        myGallery.value =
          myGallery.value.filter(
            (photo) => photo.id !== photoId,
          );

        /*
         * Also remove it from the shared gallery state
         * if it was loaded there.
         */
        gallery.value =
          gallery.value.filter(
            (photo) => photo.id !== photoId,
          );
      }

      return {

        gallery,
        myGallery,

        loading,
        myGalleryLoading,
        loadingMore,

        nextCursor,
        hasMore,

        fetchGallery,
        loadMore,
        refreshGallery,
        fetchMyGallery,
        deleteMyPhoto,
      };

    },
  );
