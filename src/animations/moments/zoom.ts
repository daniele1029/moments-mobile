import { gsap } from "gsap";

export function animateZoom(

  element: HTMLElement,

  scale: number,

) {

  gsap.to(

    element,

    {

      scale,

      duration: .2,

      ease: "power2.out",

    }

  );

}
