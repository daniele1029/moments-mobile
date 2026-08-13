import { gsap } from "gsap";

export function animateSwipe(

  element: HTMLElement,

  x: number,

) {

  gsap.to(

    element,

    {

      x,

      duration: .35,

      ease: "power3.out",

    }

  );

}
