import { focusOn } from './setFocus';
import { getTabbableNodes, contains } from './utils/DOMutils';

const getRelativeFocusable = (element: Element, scope: HTMLElement | HTMLDocument) => {
  if (!element || !scope || !contains(scope as Element, element)) {
    return {};
  }

  const focusables = getTabbableNodes([scope as HTMLElement], new Map());
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
  /**
   * the component to "scope" focus in
   * @default document.body
   */
  scope?: HTMLElement | HTMLDocument;
  /**
   * enables cycling inside the scope
   * @default true
   */
  cycle?: boolean;
  /**
   * options for focus action to control it more precisely (ie. `{ preventScroll: true }`)
   */
  focusOptions?: FocusOptions;
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
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusNextElement = (baseElement: Element, options: FocusNextOptions = {}): void => {
  const { scope, cycle } = defaultOptions(options);
  const { next, first } = getRelativeFocusable(baseElement as Element, scope);
  const newTarget = next || (cycle && first);

  if (newTarget) {
    focusOn(newTarget.node, options.focusOptions);
  }
};

/**
 * focuses prev element in the tab order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusPrevElement = (baseElement: Element, options: FocusNextOptions = {}): void => {
  const { scope, cycle } = defaultOptions(options);
  const { prev, last } = getRelativeFocusable(baseElement as Element, scope);
  const newTarget = prev || (cycle && last);

  if (newTarget) {
    focusOn(newTarget.node, options.focusOptions);
  }
};
