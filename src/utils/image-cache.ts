class ImageCache {

  private readonly cache =
    new Map<string, HTMLImageElement>();

  private readonly MAX_ITEMS = 20;

  preload(url?: string) {

    if (!url) {

      return;

    }

    const existing =
      this.cache.get(url);

    if (existing) {

      this.cache.delete(url);

      this.cache.set(
        url,
        existing,
      );

      return;

    }

    const image =
      new Image();

    image.decoding = "async";

    image.loading = "eager";

    image.src = url;

    this.cache.set(
      url,
      image,
    );

    if (

      this.cache.size >

      this.MAX_ITEMS

    ) {

      const oldest =
        this.cache.keys().next().value;

      if (oldest) {

        this.cache.delete(oldest);

      }

    }

  }

  has(url?: string) {

    if (!url) {

      return false;

    }

    return this.cache.has(url);

  }

  clear() {

    this.cache.clear();

  }

}

export const imageCache =
  new ImageCache();
