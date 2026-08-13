import api from "@/api/axios";

export interface UploadResponse {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  url: string;
  photosUsed: number;
  remainingUploads: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

class UploadService {
  async upload(
    blob: Blob,
    guestId: string,
    originalFilename?: string,
    caption?: string,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResponse> {
    const form = new FormData();

    form.append(
      "photo",
      new File(
        [blob],
        originalFilename ??
        `photo-${Date.now()}.${
          blob.type.split("/")[1] ?? "jpg"
        }`,
        {
          type: blob.type || "image/jpeg",
        },
      ),
    );

    form.append("guestId", guestId);

    if (caption?.trim()) {
      form.append(
        "caption",
        caption.trim(),
      );
    }

    const response =
      await api.post<ApiResponse<UploadResponse>>(
        "/photos",
        form,
        {
          timeout: 90000,
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (event) => {
            if (!event.total) {
              return;
            }

            onProgress?.(
              Math.round(
                event.loaded / event.total * 100,
              ),
            );
          },
        },
      );

    return response.data.data;
  }
}

export default new UploadService();
