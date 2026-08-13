export type EventStatus =
  | "UPCOMING"
  | "LIVE"
  | "FINISHED";

export interface Settings {
  id: string;

  eventTitle: string;

  brideName: string;

  groomName: string;

  venue: string;

  weddingDate: string | null;

  eventStatus: EventStatus;

  allowGuestUploads: boolean;

  showGallery: boolean;

  defaultPhotoLimit: number;

  footerMessage: string;

  createdAt: string;

  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
