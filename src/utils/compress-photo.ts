const MAX_WIDTH = 1920;
const TARGET_SIZE_BYTES = 1_800_000;

interface CompressionStep {
  maxWidth: number;
  quality: number;
}

const compressionSteps: CompressionStep[] = [
  { maxWidth: MAX_WIDTH, quality: 0.78 },
  { maxWidth: MAX_WIDTH, quality: 0.72 },
  { maxWidth: 1600, quality: 0.72 },
  { maxWidth: 1440, quality: 0.72 },
];

export async function compressPhoto(
  file: File,
): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif"
  ) {
    return file;
  }

  try {
    const image =
      await loadImage(file);

    let compressed: Blob | null = null;

    for (const step of compressionSteps) {
      compressed =
        await renderJpeg(
          image,
          step.maxWidth,
          step.quality,
        );

      if (compressed.size <= TARGET_SIZE_BYTES) {
        break;
      }
    }

    if (!compressed) {
      return file;
    }

    const compressedFile =
      new File(
        [compressed],
        createJpegFilename(file.name),
        {
          type: "image/jpeg",
          lastModified: file.lastModified,
        },
      );

    if (import.meta.env.DEV) {
      console.info(
        "Photo compressed",
        {
          original: formatSize(file.size),
          compressed: formatSize(
            compressedFile.size,
          ),
          saved: formatSize(
            file.size - compressedFile.size,
          ),
          dimensions:
            `${image.naturalWidth} × ${image.naturalHeight}`,
        },
      );
    }

    return compressedFile;
  }
  catch (error) {
    console.warn(
      "Photo compression skipped; using original file.",
      error,
    );

    return file;
  }
}

function loadImage(
  file: File,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const url =
        URL.createObjectURL(file);

      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(
          new Error(
            "The selected image could not be read.",
          ),
        );
      };

      image.src = url;
    },
  );
}

function renderJpeg(
  image: HTMLImageElement,
  maxWidth: number,
  quality: number,
): Promise<Blob> {
  const scale =
    Math.min(
      1,
      maxWidth / image.naturalWidth,
    );

  const width =
    Math.round(
      image.naturalWidth * scale,
    );

  const height =
    Math.round(
      image.naturalHeight * scale,
    );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas is unavailable for compression.",
    );
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Could not compress the image.",
              ),
            );

            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        quality,
      );
    },
  );
}

function createJpegFilename(
  originalName: string,
) {
  const baseName =
    originalName.replace(
      /\.[^/.]+$/,
      "",
    ) || `photo-${Date.now()}`;

  return `${baseName}.jpg`;
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
