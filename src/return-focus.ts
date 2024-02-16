import { getTabbableNodes } from './utils/DOMutils';

type SetRef = () => Element | null;
type Ref = null | (() => Element | null);

type ElementLocation = {
  current: SetRef;
  parent: Ref;
  left: Ref;
  right: Ref;
};

function weakRef(value: Element): SetRef;
function weakRef(value: Element | null): null | Ref;
function weakRef(value: Element | null): SetRef | Ref | null {
  if (!value) return null;

  const w = value ? new WeakRef(value) : null;

  return () => w?.deref() || null;
}

type Location = {
  stack: ReadonlyArray<ElementLocation>;
  ownerDocument: Document;
  element: SetRef;
};

export const recordElementLocation = (element: Element): Location => {
  const stack: ElementLocation[] = [];
  let currentElement: Element | null = element;

  while (currentElement && currentElement !== document.body) {
    stack.push({
      current: weakRef(currentElement),
      parent: weakRef(currentElement.parentElement),
      left: weakRef(currentElement.previousElementSibling),
      right: weakRef(currentElement.nextElementSibling),
    });

    currentElement = currentElement.parentElement;
  }

  return {
    element: weakRef(element),
    stack,
    ownerDocument: element.ownerDocument,
  };
};

const restoreFocusTo = (location: Location): Element | undefined => {
  const { stack, ownerDocument } = location;
  const visibilityCache = new Map();

  for (const line of stack) {
    const parent = line.parent?.();

    // is it still here?
    if (parent && ownerDocument.contains(parent)) {
      const left = line.left?.();
      const right = line.right?.();
      const focusables = getTabbableNodes([parent], visibilityCache);
      let aim =
        // that is element itself
        left?.nextElementSibling ??
        // or somebody to the right?
        right ??
        // or somebody to the left
        left;

      while (aim) {
        for (const focusable of focusables) {
          if (aim?.contains(focusable.node)) {
            return focusable.node;
          }
        }

        aim = aim.nextElementSibling;
      }

      if (focusables.length) {
        // if parent contains a focusable - move there
        return focusables[0].node;
      }
    }
  }

  // nothing matched
  return undefined;
};

/**
 * Captures the current focused element to restore focus as close as possible in the future
 * Handles situations where the focused element is removed from the DOM or no longer focusable
 * moving focus to the closest focusable element
 * @param targetElement - element where focus should be restored
 * @returns a function returning a new element to focus
 */
export const captureFocusRestore = (targetElement: Element): (() => Element | undefined) => {
  const location = recordElementLocation(targetElement);

  return () => {
    return restoreFocusTo(location);
  };
};
