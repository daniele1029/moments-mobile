import { defineStore } from "pinia";
import { tokenService } from "@/services/token.service";

export interface Guest {
  id: string;
  fullName: string;
  photoLimit: number;
  photosUsed: number;
  remainingUploads: number;
}

export const useAuthStore =
  defineStore("auth", {
    state: () => ({
      guest: null as Guest | null,
      authenticated: false,
    }),

    getters: {

      remainingUploads(state) {

        return state.guest?.remainingUploads ?? 0;

      },

    },

    actions: {

      login(
        guest: Guest,
      ) {

        this.guest = guest;

        this.authenticated = true;

      },

      startSession(
        guest: Guest & { accessToken: string },
      ) {
        tokenService.set(guest.accessToken);

        this.guest = {
          id: guest.id,
          fullName: guest.fullName,
          photoLimit: guest.photoLimit,
          photosUsed: guest.photosUsed,
          remainingUploads: guest.remainingUploads,
        };

        this.authenticated = true;
      },

      logout() {
        tokenService.clear();
        this.guest = null;
        this.authenticated = false;
      },

      updateUploadState(
        photosUsed: number,
        remainingUploads: number,
      ) {

        if (!this.guest) {

          return;

        }

        this.guest.photosUsed =
          photosUsed;

        this.guest.remainingUploads =
          remainingUploads;

      },

    },

  });
