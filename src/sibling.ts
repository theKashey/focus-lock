import { focusOn } from './commands';
import { getTabbableNodes, contains } from './utils/DOMutils';

/**
 * for a given `element` in a given `scope` returns focusable siblings
 * @param element - base element
 * @param scope - common parent. Can be document, but better to narrow it down for performance reasons
 * @returns {prev,next} - references to a focusable element before and after
 * @returns undefined - if operation is not applicable
 */
export const getRelativeFocusable = (element: Element, scope: HTMLElement | Document) => {
  if (!element || !scope || !contains(scope as Element, element)) {
    return {};
  }

  const focusables = getTabbableNodes([scope as HTMLElement], new Map());
  const current = focusables.findIndex(({ node }) => node === element);

  if (current === -1) {
    // an edge case, when anchor element is not found
    return undefined;
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
 * @param fromElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusNextElement = (fromElement: Element, options: FocusNextOptions = {}): void => {
  const { scope, cycle } = defaultOptions(options);
  const solution = getRelativeFocusable(fromElement as Element, scope);

  if (!solution) {
    return;
  }

  const { next, first } = solution;
  const newTarget = next || (cycle && first);

  if (newTarget) {
    focusOn(newTarget.node, options.focusOptions);
  }
};

/**
 * focuses prev element in the tab order
 * @param fromElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusPrevElement = (fromElement: Element, options: FocusNextOptions = {}): void => {
  const { scope, cycle } = defaultOptions(options);
  const solution = getRelativeFocusable(fromElement as Element, scope);

  if (!solution) {
    return;
  }

  const { prev, last } = solution;
  const newTarget = prev || (cycle && last);

  if (newTarget) {
    focusOn(newTarget.node, options.focusOptions);
  }
};
