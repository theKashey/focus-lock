import { getTabbableNodes } from './utils/DOMutils';
import { isNotAGuard } from './utils/is';

const getRelativeFocusable = (element, scope) => {
  if (!element || !scope || !scope.contains(element)) {
    return {};
  }
  const focusables = getTabbableNodes([scope]);
  const current = focusables.indexOf(element);
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

/**
 * focuses next element in the tab-order
 * @param baseElement
 * @param scope
 * @param cycle
 */
export const focusNextElement = (baseElement, { scope = document.body, cycle = true }) => {
  const { next, first } = getRelativeFocusable(baseElement, scope);
  const node = next || (cycle && first);
  if (node) {
    node.focus();
  }
};

/**
 * focuses prev element in the tab order
 * @param baseElement
 * @param parent
 * @param cycle
 */
export const focusPrevElement = (baseElement, { parent = document.body, cycle = true }) => {
  const { prev, last } = getRelativeFocusable(baseElement, parent);
  const node = prev || (cycle && last);
  if (node) {
    node.focus();
  }
};
