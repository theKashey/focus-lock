import { getTabbableNodes } from './utils/DOMutils';

const getRelativeFocusable = (element: HTMLInputElement, scope: HTMLElement | HTMLDocument) => {
  if (!element || !scope || !scope.contains(element)) {
    return {};
  }
  const focusables = getTabbableNodes([scope as HTMLElement]);
  const current = focusables.findIndex(({ node }) => node === element);
  if (current === -1) {
    return {};
  }

  return {
    prev: focusables[current - 1],
    next: focusables[current + 1],
    first: focusables[0],
    last: focusables[focusables.length - 1],
  };
};

interface FocusNextOptions {
  scope?: HTMLElement | HTMLDocument;
  cycle?: boolean;
}

/**
 * focuses next element in the tab-order
 * @param baseElement
 * @param scope
 * @param cycle
 */
export const focusNextElement = (
  baseElement: HTMLInputElement,
  { scope = document.body, cycle = true }: FocusNextOptions
) => {
  const { next, first } = getRelativeFocusable(baseElement, scope);
  const newTarget = next || (cycle && first);
  if (newTarget) {
    newTarget.node.focus();
  }
};

/**
 * focuses prev element in the tab order
 * @param baseElement
 * @param parent
 * @param cycle
 */
export const focusPrevElement = (
  baseElement: HTMLInputElement,
  { scope = document.body, cycle = true }: FocusNextOptions
) => {
  const { prev, last } = getRelativeFocusable(baseElement, scope);
  const newTarget = prev || (cycle && last);
  if (newTarget) {
    newTarget.node.focus();
  }
};
