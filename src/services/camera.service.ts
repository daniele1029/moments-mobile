class CameraService {

  private stream: MediaStream | null = null;

  private facingMode: "user" | "environment" =
    "environment";

  async start(
    video: HTMLVideoElement,
  ) {

    this.stop();

    this.stream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: this.facingMode,
          width: { ideal: 4032 },
          height: { ideal: 3024 },
        },

        audio: false,

      });

    video.srcObject =
      this.stream;

    await video.play();

    console.log(
      "Camera Resolution:",
      video.videoWidth,
      "x",
      video.videoHeight,
    );

  }

  stop() {

    if (!this.stream) {

      return;

    }

    this.stream
      .getTracks()
      .forEach(track => {

        track.stop();

      });

    this.stream = null;

  }

  async flip(
    video: HTMLVideoElement,
  ) {

    this.facingMode =
      this.facingMode === "environment"
        ? "user"
        : "environment";

    await this.start(video);

  }

  async capture(video: HTMLVideoElement ): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Canvas context unavailable.",);

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return new Promise((resolve, reject)=>{
      canvas.toBlob(
        (blob)=>{
          if (!blob) {
            reject(
              new Error("Capture failed.")
            );
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95,
      );
    });
  }

  async rotateBlob(
    blob: Blob,
    rotation: number,
  ): Promise<Blob> {

    if (rotation === 0) {

      return blob;

    }

    const image =
      await new Promise<HTMLImageElement>((resolve, reject) => {

        const img =
          new Image();

        img.onload =
          () => resolve(img);

        img.onerror =
          reject;

        img.src =
          URL.createObjectURL(blob);

      });

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d");

    if (!context) {

      throw new Error(
        "Canvas context unavailable.",
      );

    }

    const width =
      image.width;

    const height =
      image.height;

    if (
      rotation === 90 ||
      rotation === 270
    ) {

      canvas.width =
        height;

      canvas.height =
        width;

    } else {

      canvas.width =
        width;

      canvas.height =
        height;

    }

    switch (rotation) {

      case 90:

        context.translate(
          canvas.width,
          0,
        );

        break;

      case 180:

        context.translate(
          canvas.width,
          canvas.height,
        );

        break;

      case 270:

        context.translate(
          0,
          canvas.height,
        );

        break;

    }

    context.rotate(
      rotation *
      Math.PI /
      180,
    );

    context.drawImage(
      image,
      0,
      0,
    );

    URL.revokeObjectURL(
      image.src,
    );

    return new Promise(
      (resolve, reject) => {

        canvas.toBlob(

          (rotatedBlob) => {

            if (!rotatedBlob) {

              reject(
                new Error(
                  "Rotation failed.",
                ),
              );

              return;

            }

            resolve(
              rotatedBlob,
            );

          },

          "image/jpeg",

          0.95,

        );

      },

    );

  }
}

export default
new CameraService();
