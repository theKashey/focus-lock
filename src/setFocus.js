import getFocusMerge from './focusMerge';

export const focusOn = (target) => {
  target.focus();
  if (target.contentWindow) {
    target.contentWindow.focus();
  }
};

export default (topNode, lastNode) => {
  const focusable = getFocusMerge(topNode, lastNode);

  if (focusable) {
    focusOn(focusable.node);
  }
};
