import { useMomentsViewerStore } from "@/stores/moments-viewer-store";

interface GestureCallbacks {

  onMove: (offset: number) => void;

  onNext: () => void;

  onPrevious: () => void;

  onReset: () => void;

}

export class MomentsGestures {

  private readonly viewer =
    useMomentsViewerStore();

  private startX = 0;

  private currentX = 0;

  private velocity = 0;

  private lastX = 0;

  private lastTime = 0;

  private dragging = false;

  private edgeDragging = false;

  constructor(

    private readonly element: HTMLElement,

    private readonly threshold: number,

    private readonly callbacks: GestureCallbacks,

  ) {

    this.bind();

  }

  private bind() {

    this.element.addEventListener(
      "pointerdown",
      this.pointerDown,
    );

    this.element.addEventListener(
      "pointermove",
      this.pointerMove,
    );

    this.element.addEventListener(
      "pointerup",
      this.pointerUp,
    );

    this.element.addEventListener(
      "pointercancel",
      this.pointerUp,
    );

  }

  destroy() {

    this.element.removeEventListener(
      "pointerdown",
      this.pointerDown,
    );

    this.element.removeEventListener(
      "pointermove",
      this.pointerMove,
    );

    this.element.removeEventListener(
      "pointerup",
      this.pointerUp,
    );

    this.element.removeEventListener(
      "pointercancel",
      this.pointerUp,
    );

  }

  private pointerDown = (
    e: PointerEvent,
  ) => {

    if (this.viewer.isZoomed) {

      return;

    }

    this.dragging = true;

    this.startX = e.clientX;

    this.lastX = e.clientX;

    this.lastTime = performance.now();

    this.velocity = 0;

    this.currentX = 0;

  };

  private pointerMove = (
    e: PointerEvent,
  ) => {

    if (

      this.viewer.isZoomed ||

      !this.dragging

    ) {

      return;

    }

    this.currentX = e.clientX - this.startX;

    const now =
      performance.now();

    const dt =
      now - this.lastTime;

    if (dt > 0) {

      this.velocity =
        (e.clientX - this.lastX) / dt;

    }

    this.lastTime = now;

    this.lastX = e.clientX;

    const atFirst =
      !this.viewer.hasPrevious &&
      this.currentX > 0;

    const atLast =
      !this.viewer.hasNext &&
      this.currentX < 0;

    this.edgeDragging =
      atFirst || atLast;

    if (this.edgeDragging) {
      return;
    }

    this.edgeDragging = false;

    this.callbacks.onMove(
      this.currentX,
    );

  };

  private pointerUp = () => {
    if (this.viewer.isZoomed || !this.dragging) {
      this.dragging = false;
      return;
    }
    this.dragging = false;

    if (this.edgeDragging) {
      this.edgeDragging = false;
      this.currentX = 0;
      this.velocity = 0;
      this.callbacks.onReset();
      return;
    }

    const momentum = this.currentX + this.velocity * 220;

    if (momentum < -this.threshold) {
      this.callbacks.onNext();
    }
    else if (momentum > this.threshold) {
      this.callbacks.onPrevious();
    }
    else {
      this.callbacks.onReset();
    }
    this.currentX = 0;
    this.velocity = 0;
  };

}
