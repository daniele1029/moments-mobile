import { defineStore } from "pinia";

import SettingsService
  from "../services/settings.service";

import type {
  Settings,
} from "../types/settings";

interface SettingsState {

  loading: boolean;

  loaded: boolean;

  settings: Settings | null;

}

export const useSettingsStore =
  defineStore(
    "settings",
    {
      state:
        (): SettingsState => ({
          loading: false,

          loaded: false,

          settings: null,
        }),

      getters: {

        hasSettings: (state) =>
          state.settings !== null,

      },

      actions: {

        async fetchSettings(
          force = false
        ) {

          if (
            this.loaded &&
            !force
          ) {
            return;
          }

          this.loading = true;

          try {

            this.settings =
              await SettingsService.getSettings();

            this.loaded = true;

          } finally {

            this.loading = false;

          }

        },

        clear() {

          this.loaded = false;

          this.settings = null;

        },

      },

    }
  );
