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
 * - If a `bound` only has a `width` or `height` we constraint it by that
 *   property and ignore the other
 */
export function resizeIn(size: Size, ...bounds: Bound[]): Size {
  const currentSize = { ...size };
  for (const bound of bounds) {
    if (!bound) continue;
    if (typeof bound.width === "number") {
      currentSize.height =
        (currentSize.height * bound.width) / currentSize.width;
      currentSize.width = bound.width;
    }
    if (typeof bound.height === "number") {
      currentSize.width =
        (currentSize.width * bound.height) / currentSize.height;
      currentSize.height = bound.height;
    }
  }
  return currentSize;
}
