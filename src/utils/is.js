const isElementHidden = (computedStyle) => {
  if (!computedStyle || !computedStyle.getPropertyValue) {
    return false;
  }
  return (
    computedStyle.getPropertyValue('display') === 'none' ||
    computedStyle.getPropertyValue('visibility') === 'hidden'
  );
};

export const isVisible = node => (
  (
    !node ||
    node === document ||
    node.nodeType === Node.DOCUMENT_NODE
  ) ||
  (
    !isElementHidden(window.getComputedStyle(node, null)) &&
    isVisible(
      (node.parentNode && node.parentNode.nodeType === node.DOCUMENT_FRAGMENT_NODE) ?
        node.parentNode.host :
        node.parentNode,
    )
  )
);

export const notHiddenInput = node => !(
  (node.tagName === 'INPUT' || node.tagName === 'BUTTON') &&
  (node.type === 'hidden' || node.disabled)
);
export const isGuard = node => (node && node.dataset && node.dataset.focusGuard);
export const isNotAGuard = node => !isGuard(node);
