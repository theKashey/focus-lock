export declare const NEW_FOCUS = 'NEW_FOCUS';
export declare const newFocus: (
  innerNodes: HTMLInputElement[],
  outerNodes: HTMLInputElement[],
  activeElement: HTMLInputElement,
  lastNode: HTMLInputElement | null
) => number | undefined | typeof NEW_FOCUS;
