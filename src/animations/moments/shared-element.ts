export interface SharedElementResult {

  clone: HTMLImageElement;

  rect: DOMRect;

}

export function createSharedElement(

  image: HTMLImageElement,

): SharedElementResult {

  const rect =
    image.getBoundingClientRect();

  const clone =
    image.cloneNode(true) as HTMLImageElement;

  clone.style.position = "fixed";

  clone.style.left = `${rect.left}px`;

  clone.style.top = `${rect.top}px`;

  clone.style.width = `${rect.width}px`;

  clone.style.height = `${rect.height}px`;

  clone.style.margin = "0";

  clone.style.objectFit = "cover";

  clone.style.zIndex = "100000";

  clone.style.pointerEvents = "none";

  clone.style.borderRadius = "16px";

  clone.style.boxShadow =
    "0 24px 80px rgba(0,0,0,.35)";

  document.body.appendChild(clone);

  return {

    clone,

    rect,

  };

}

export function destroySharedElement(

  clone: HTMLImageElement,

){

  clone.remove();

}
