import getFocusMerge from './focusMerge';

export const focusOn = (target) => {
  target.focus();
  if (target.contentWindow) {
    target.contentWindow.focus();
  }
};

let guardCount = 0;
let lockDisabled = false;

export default (topNode, lastNode) => {
  const focusable = getFocusMerge(topNode, lastNode);

  if (lockDisabled) {
    return;
  }

  if (focusable) {
    if (guardCount > 2) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(
          'FocusLock: focus-fighting detected. Only one focus management system could be active. ' +
          'See https://github.com/theKashey/focus-lock/#focus-fighting',
        );
        lockDisabled = true;
        setTimeout(() => {
          lockDisabled = false;
        }, 1);
      }
      return;
    }
    guardCount++;
    focusOn(focusable.node);
    guardCount--;
  }
};
