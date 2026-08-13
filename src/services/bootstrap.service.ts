import authService from "@/services/auth.service";

import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useUIStore } from "@/stores/ui-store";
import { tokenService } from "@/services/token.service";

export default class BootstrapService {

  static async initialize() {
    const app =
      useAppStore();

    const settings =
      useSettingsStore();

    const auth =
      useAuthStore();

    const ui =
      useUIStore();

    const token =
      tokenService.get();

    if (!token) {
      console.log("No saved token.");

      auth.logout();

      ui.openAuthentication();
    } else {
      try {
        console.log("Restoring session...");

        const guest =
          await authService.me();

        console.log("Session restored:", guest);

        auth.login(guest);

        ui.closeAuthentication();
      } catch (error) {
        console.log("Token is invalid or expired:", error);

        auth.logout();

        ui.openAuthentication();
      }
    }

    app.setProgress(
      10,
      "Loading event settings...",
    );

    await settings.fetchSettings();

    app.setProgress(
      40,
      "Preparing gallery...",
    );

    /*
     * TODO:
     * Load gallery preview.
     */

    app.setProgress(
      90,
      "Almost ready...",
    );

    /*
     * TODO:
     * Preload assets.
     */

    app.finish();
  }

}
