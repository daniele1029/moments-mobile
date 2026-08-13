import { gsap } from "gsap";

export function animateOpen(
  element: HTMLElement,
) {

  gsap.killTweensOf(element);

  return gsap.fromTo(

    element,

    {

      opacity: 0,

      scale: .94,

      y: 24,

      filter: "blur(10px)",

    },

    {

      opacity: 1,

      scale: 1,

      y: 0,

      filter: "blur(0px)",

      duration: .45,

      ease: "power3.out",

    }

  );

}

export function liftPhoto(
  element: HTMLElement,
) {

  gsap.to(element, {

    boxShadow:
      "0 24px 60px rgba(0,0,0,.45)",

    duration: .18,

    ease: "power2.out",

  });

}

export function releasePhoto(
  element: HTMLElement,
) {

  gsap.to(element, {

    boxShadow:
      "0 0 0 rgba(0,0,0,0)",

    duration: .22,

    ease: "power2.out",

  });

}

export async function animateSharedOpen(
  clone: HTMLImageElement,
) {

  const vw =
    window.innerWidth;

  const vh =
    window.innerHeight;

  await gsap.to(

    clone,

    {

      left: 0,

      top: 0,

      width: vw,

      height: vh,

      borderRadius: 0,

      duration: .45,

      ease: "power3.inOut",

    },

  );

}
