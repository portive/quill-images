// export async function getImageSize(element: HTMLImageElement) {
//   const image = new Image();
//   image.onload = () => {
//     console.log(image.width, image.height);
//   }
// }

export function setStyles<T extends HTMLElement>(
  element: T,
  styles: Partial<T["style"]>
): () => void {
  const originalStyles: Partial<CSSStyleDeclaration> = {};

  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      // Store the original style value
      originalStyles[key] = element.style[key as any];
      // Set the new style value
      element.style[key as any] = styles[key] as string;
    }
  }

  // Return a function that reverts the styles back to original
  return function revertStyles() {
    for (const key in originalStyles) {
      if (originalStyles.hasOwnProperty(key)) {
        element.style[key as any] = originalStyles[key] as string;
      }
    }
  };
}

export function getImageSize(
  element: HTMLImageElement
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = function () {
      reject(new Error("Failed to load image"));
    };

    image.src = element.src;
  });
}

type Size = { width: number; height: number };
type Bound = { width?: number; height?: number } | null | undefined;

/**
 * Takes a `size` object and constrains it within any given bounds.
 *
 * - If a `bound` is undefined then we skip it.
 * -If a `bound` only has a `width` or `height` we constraint it by that
 *   property and ignore the other
 */
export function resizeIn(size: Size, ...bounds: Bound[]): Size {
  const currentSize = { ...size };
  for (const bound of bounds) {
    if (!bound) continue;
    if (typeof bound.width === "number" && typeof bound.height === "number") {
      const aspect = size.width / size.height;
      const boundAspect = bound.width / bound.height;
      if (aspect > boundAspect) {
        if (size.width > bound.width) {
          currentSize.height =
            (currentSize.height * bound.width) / currentSize.width;
          currentSize.width = bound.width;
        }
      } else {
        if (size.height > bound.height) {
          currentSize.width =
            (currentSize.width * bound.height) / currentSize.height;
          currentSize.height = bound.height;
        }
      }
    } else if (typeof bound.width === "number") {
      if (size.width > bound.width) {
        currentSize.height =
          (currentSize.height * bound.width) / currentSize.width;
        currentSize.width = bound.width;
      }
    } else if (typeof bound.height === "number") {
      if (size.height > bound.height) {
        currentSize.width =
          (currentSize.width * bound.height) / currentSize.height;
        currentSize.height = bound.height;
      }
    }
  }
  return {
    width: Math.round(currentSize.width),
    height: Math.round(currentSize.height),
  };
}

export function getSizeFromUrl(url: string): Size {
  const u = new URL(url);
  const sizeParts = u.pathname
    .split("/")
    .pop()
    ?.split(".")[0]
    .split("--")
    .pop()
    ?.split("x");
  if (sizeParts === undefined) {
    throw new Error(`Invalid url. Could not parse image size from ${url}`);
  }
  const width = parseInt(sizeParts[0]);
  const height = parseInt(sizeParts[1]);
  if (isNaN(width) || isNaN(height)) {
    throw new Error(`Invalid url. Could not parse image size from ${url}`);
  }
  return { width, height };
}

/**
 * Takes a url to an image and returns a modified url that's been resized to
 * a specific dimension. If the image is at a url that cannot be resized,
 * this method just returns the original url.
 */
export function generateResizeImageUrl(url: string, size: Size): string {
  try {
    const originalSize = getSizeFromUrl(url);
    const u = new URL(url);
    const baseUrl = `${u.origin}${u.pathname}`;
    if (
      size.width === originalSize.width &&
      size.height === originalSize.height
    ) {
      return baseUrl;
    } else {
      const srcSetSize = resizeIn(size, originalSize);
      return `${baseUrl}?size=${srcSetSize.width}x${srcSetSize.height}`;
    }
  } catch (e) {
    return url;
  }
}

/**
 * Takes any URL and returns the best srcset for it.
 *
 * If it's a blob, it just returns the blob url at its original size as resizing
 * is not necessary.
 *
 * If it's a Portive URL, adds resizing parameters to it.
 */
export function generateSrcSet({
  url,
  size,
}: {
  url: string;
  size: Size;
}): string {
  /**
   * If it's a url from `createObjectURL` then just return it
   */
  if (url.startsWith("blob:")) return url;
  // const originalSize = getSizeFromUrl(url);
  const src1x = generateSrc({
    url,
    size,
  });
  const src2x = generateSrc({
    url,
    size: { width: size.width * 2, height: size.height * 2 },
  });
  const src3x = generateSrc({
    url,
    size: { width: size.width * 3, height: size.height * 3 },
  });
  return `${src1x}, ${src2x} 2x, ${src3x} 3x`;
}

function generateSrc({ url, size }: { url: string; size: Size }): string {
  /**
   * If it's a url from `createObjectURL` then just return it
   */
  if (url.startsWith("blob:")) return url;
  return generateResizeImageUrl(url, size);
}
