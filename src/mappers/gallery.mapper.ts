import type {
  GalleryPhoto,
} from "@/services/gallery.service";

import type {
  MomentPhoto,
} from "@/stores/moments-viewer-store";

export function toMomentPhoto(
  photo: GalleryPhoto,
): MomentPhoto {

  return {
    id: photo.id,
    url: photo.url,
    guestName: photo.guestName,
    uploadedAt: photo.uploadedAt,
    caption: photo.caption,
  };

}

export function toMomentPhotos(
  photos: GalleryPhoto[],
): MomentPhoto[] {

  return photos.map(
    toMomentPhoto,
  );

}
