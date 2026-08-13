import axios from "axios";

import {
  tokenService,
} from "@/services/token.service";

const apiUrl =
  import.meta.env.VITE_API_URL || import.meta.env.QCLI_API_URL;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL or QCLI_API_URL is missing.",
  );
}

const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      tokenService.get();

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`,
      );
    }

    return config;
  },
);

export default api;
