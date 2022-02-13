import { getFocusMerge } from './focusMerge';

export const focusOn = (target: Element | HTMLFrameElement | HTMLElement, focusOptions?: FocusOptions | undefined) => {
  if ('focus' in target) {
    target.focus(focusOptions);
  }
  if ('contentWindow' in target && target.contentWindow) {
    target.contentWindow.focus();
  }
};

let guardCount = 0;
let lockDisabled = false;

interface FocusLockFocusOptions {
  focusOptions?: FocusOptions;
}

export const setFocus = (topNode: HTMLElement, lastNode: Element, options: FocusLockFocusOptions = {}) => {
  const focusable = getFocusMerge(topNode, lastNode);

  if (lockDisabled) {
    return;
  }

  if (focusable) {
    if (guardCount > 2) {
      // tslint:disable-next-line:no-console
      console.error(
        'FocusLock: focus-fighting detected. Only one focus management system could be active. ' +
          'See https://github.com/theKashey/focus-lock/#focus-fighting'
      );
      lockDisabled = true;
      setTimeout(() => {
        lockDisabled = false;
      }, 1);
      return;
    }
    guardCount++;
    focusOn(focusable.node, options.focusOptions);
    guardCount--;
  }
};
