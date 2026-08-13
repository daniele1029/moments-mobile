import { gsap } from "gsap";

export function animateClose(
  element: HTMLElement,
) {

  return gsap.to(

    element,

    {

      scale: .94,

      opacity: 0,

      duration: .25,

      ease: "power2.in",

    }

  );

}
