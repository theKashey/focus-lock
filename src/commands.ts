export const focusOn = (
  target: Element | HTMLFrameElement | HTMLElement,
  focusOptions?: FocusOptions | undefined
): void => {
  if ('focus' in target) {
    target.focus(focusOptions);
  }

  if ('contentWindow' in target && target.contentWindow) {
    target.contentWindow.focus();
  }
};
