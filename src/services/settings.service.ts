import api from "../api/axios";

import type {
  Settings,
  ApiResponse,
} from "@/types/settings";

class SettingsService {

  async getSettings() {

    const response =
      await api.get<ApiResponse<Settings>>(
        "/settings"
      );

    return response.data.data;

  }

}

export default new SettingsService();
