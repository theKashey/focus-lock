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

const defaultOptions = (options: FocusNextOptions) =>
  Object.assign(
    {
      scope: document.body,
      cycle: true,
    },
    options
  );

/**
 * focuses next element in the tab-order
 * @param baseElement
 * @param options
 */
export const focusNextElement = (baseElement: Element, options: FocusNextOptions = {}) => {
  const { scope, cycle } = defaultOptions(options);
  const { next, first } = getRelativeFocusable(baseElement as HTMLInputElement, scope);
  const newTarget = next || (cycle && first);
  if (newTarget) {
    newTarget.node.focus();
  }
};

/**
 * focuses prev element in the tab order
 * @param baseElement
 * @param options
 */
export const focusPrevElement = (baseElement: Element, options: FocusNextOptions = {}) => {
  const { scope, cycle } = defaultOptions(options);
  const { prev, last } = getRelativeFocusable(baseElement as HTMLInputElement, scope);
  const newTarget = prev || (cycle && last);
  if (newTarget) {
    newTarget.node.focus();
  }
};
