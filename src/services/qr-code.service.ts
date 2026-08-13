import {
  Html5Qrcode,
  Html5QrcodeScannerState,
} from "html5-qrcode";

class QrCodeService {

  private scanner: Html5Qrcode | null = null;

  async start(
    elementId: string,
    onDetected: (value: string) => void,
  ) {

    if (this.scanner) {
      return;
    }

    this.scanner = new Html5Qrcode(
      elementId,
    );

    await this.scanner.start(
      {
        facingMode: "environment",
      },
      {
        fps: 10,

        qrbox: {
          width: 260,
          height: 260,
        },

        aspectRatio: 1,
      },

      (decodedText) => {
        onDetected(decodedText);
      },

      () => {
        // Ignore scan failures
      },
    );

  }

  async stop() {
    if (!this.scanner) {
      return;
    }
    const scanner = this.scanner;
    this.scanner = null;
    try {
      if (
        scanner.getState() ===
        Html5QrcodeScannerState.SCANNING
      ) {
        await scanner.stop();
      }
    }
    catch (error) {
      console.error("Failed to stop scanner:", error,);
    }

    scanner.clear();

  }

}

export default new QrCodeService();
