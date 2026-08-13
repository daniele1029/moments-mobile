import api from "../api/axios";

export interface Guest {

  id: string;

  fullName: string;

  photoLimit: number;

  photosUsed: number;

  remainingUploads: number;

}

export interface AuthenticatedGuest extends Guest {
  accessToken: string;
}

interface ApiResponse<T> {

  success: boolean;

  data: T;

}

class AuthService {

  async login(cardUuid: string,): Promise<AuthenticatedGuest> {
    const response = await api.post<ApiResponse<AuthenticatedGuest>>(
      "/auth/login",
      {
        cardUuid,
      },
    );

    return response.data.data;
  }

  async me() {

    const response =
      await api.get<ApiResponse<Guest>>(
        "/auth/me",
      );

    return response.data.data;

  }

  async logout() {

    await api.post(
      "/auth/logout",
    );

  }

}

export default new AuthService();
