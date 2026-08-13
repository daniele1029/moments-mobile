import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {

  state: () => ({

    loading: true,

    progress: 0,

    message: "Preparing Moments...",

  }),

  actions: {

    setProgress(
      progress: number,
      message?: string,
    ) {

      this.progress = progress;

      if (message) {

        this.message = message;

      }

    },

    finish() {

      this.progress = 100;

      this.loading = false;

    },

  },

});
