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
