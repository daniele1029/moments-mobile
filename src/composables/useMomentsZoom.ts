import { ref, type Ref } from "vue";
import { gsap } from "gsap";
import { useMomentsViewerStore } from "@/stores/moments-viewer-store";

const viewer = useMomentsViewerStore();

export interface UseMomentsZoom {

  scale: Ref<number>;

  translateX: Ref<number>;

  translateY: Ref<number>;

  setScale: (scale: number) => void;

  toggleZoom: () => void;

  pan: (
    deltaX: number,
    deltaY: number,
  ) => void;

  reset: () => void;

}

export function useMomentsZoom(
  image: Ref<HTMLImageElement | null>,
): UseMomentsZoom {

  const scale = ref(1);

  const translateX = ref(0);

  const translateY = ref(0);

  const MIN_SCALE = 1;

  const MAX_SCALE = 4;

  function clamp(
    value: number,
    min: number,
    max: number,
  ) {

    return Math.min(
      max,
      Math.max(min, value),
    );

  }

  function animate() {

    if (!image.value) {
      return;
    }

    gsap.to(image.value, {

      scale: scale.value,

      x: translateX.value,

      y: translateY.value,

      duration: 0.15,

      ease: "power2.out",

      overwrite: "auto",

    });

  }

  function setScale(
    value: number,
  ) {

    const previousScale = scale.value;

    scale.value = Math.min(

      MAX_SCALE,

      Math.max(

        MIN_SCALE,

        value,

      ),

    );

    const ratio =
      scale.value / previousScale;

    translateX.value *= ratio;

    translateY.value *= ratio;

    if (scale.value === 1) {

      translateX.value = 0;

      translateY.value = 0;

    }

    viewer.setZoomed(
      scale.value > 1,
    );

    gsap.set(image.value, {
      scale: scale.value,
      x: translateX.value,
      y: translateY.value,
    });

  }

  function toggleZoom() {

    if (scale.value === 1) {

      setScale(2);

    }

    else {

      reset();

    }

  }

  function pan(
    deltaX: number,
    deltaY: number,
  ) {

    if (scale.value <= 1) {

      return;

    }

    const boundsX =
      ((scale.value - 1) * image.value!.clientWidth) / 2;

    const boundsY =
      ((scale.value - 1) * image.value!.clientHeight) / 2;

    translateX.value = clamp(
      translateX.value + deltaX,
      -boundsX,
      boundsX,
    );

    translateY.value = clamp(
      translateY.value + deltaY,
      -boundsY,
      boundsY,
    );

    gsap.set(image.value, {

      scale: scale.value,

      x: translateX.value,

      y: translateY.value,

    });

  }

  function reset() {

    scale.value = 1;

    translateX.value = 0;

    translateY.value = 0;

    viewer.setZoomed(false);

    animate();

  }

  return {

    scale,

    translateX,

    translateY,

    setScale,

    toggleZoom,

    pan,

    reset,

  };

}
