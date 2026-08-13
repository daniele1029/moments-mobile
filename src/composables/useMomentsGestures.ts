import type { Ref } from "vue";
import type { UseMomentsZoom } from "./useMomentsZoom";

export interface UseMomentsGestures {

  onPointerDown: (
    event: PointerEvent,
  ) => void;

  onPointerMove: (
    event: PointerEvent,
  ) => void;

  onPointerUp: (
    event: PointerEvent,
  ) => void;

  onPointerCancel: () => void;

}

interface UseMomentsGesturesOptions {

  image: Ref<HTMLImageElement | null>;

  zoom: UseMomentsZoom;

}

export function useMomentsGestures(
  options: UseMomentsGesturesOptions,
): UseMomentsGestures {

  let lastTap = 0;

  let dragging = false;

  let startX = 0;

  let startY = 0;

  const pointers =
    new Map<number, PointerEvent>();

  let pinchDistance = 0;

  let pinchStartScale = 1;

  function distance(): number {

    const values = [...pointers.values()];

    if (values.length < 2) {
      return 0;
    }

    const first = values[0];
    const second = values[1];

    if (!first || !second) {
      return 0;
    }

    return Math.hypot(
      first.clientX - second.clientX,
      first.clientY - second.clientY,
    );

  }

  function onPointerDown(
    event: PointerEvent,
  ) {

    pointers.set(
      event.pointerId,
      event,
    );

    if (pointers.size === 2) {

      pinchDistance =
        distance();

      pinchStartScale =
        options.zoom.scale.value;

      return;

    }

    dragging = false;

    startX = event.clientX;

    startY = event.clientY;

  }

  function onPointerMove(
    event: PointerEvent,
  ) {

    if (
      pointers.has(
        event.pointerId,
      )
    ) {

      pointers.set(
        event.pointerId,
        event,
      );

    }

    if (pointers.size === 2) {

      const currentDistance =
        distance();

      if (
        pinchDistance > 0
      ) {

        options.zoom.setScale(

          pinchStartScale *

          (

            currentDistance /

            pinchDistance

          ),

        );

      }

      return;

    }

    const dx =
      event.clientX - startX;

    const dy =
      event.clientY - startY;

    if (

      Math.abs(dx) > 4 ||

      Math.abs(dy) > 4

    ) {

      dragging = true;

    }

    if (!dragging) {

      return;

    }

    options.zoom.pan(
      dx,
      dy,
    );

    startX =
      event.clientX;

    startY =
      event.clientY;

  }

  function onPointerUp(
    event: PointerEvent,
  ) {

    pointers.delete(
      event.pointerId,
    );

    if (
      pointers.size >= 1
    ) {

      return;

    }

    if (dragging) {

      dragging = false;

      return;

    }

    const now =
      Date.now();

    if (

      now - lastTap < 250

    ) {

      options.zoom.toggleZoom();

      lastTap = 0;

      return;

    }

    lastTap = now;

  }

  function onPointerCancel() {

    pointers.clear();

    dragging = false;

  }

  return {

    onPointerDown,

    onPointerMove,

    onPointerUp,

    onPointerCancel,

  };

}
