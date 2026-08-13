import api from "@/api/axios";

export interface GalleryPage {
  photos: GalleryPhoto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  guestName: string;
  caption: string | null;
  uploadedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

class GalleryService {
  async getGallery(cursor?: string, type: "guest_photo" | "photo_booth"  = "guest_photo") {
    const response = await api.get<ApiResponse<GalleryPage>>(
        "/gallery",
        {
          params: { limit: 20, cursor, type },
        },
      );
    return response.data.data;
  }

  async getMyGallery() {
    const response =
      await api.get<ApiResponse<GalleryPhoto[]>>("/gallery/mine");
    return response.data.data;
  }

  async deletePhoto(
    photoId: string,
  ) {
    await api.delete(
      `/photos/${photoId}`,
    );
  }

}

export default new GalleryService();
