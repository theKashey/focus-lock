/**
 * returns active element from document or from shadowdom
 */
export const getActiveElement = (): HTMLElement | undefined => {
  return (document.activeElement
    ? document.activeElement.shadowRoot
      ? document.activeElement.shadowRoot.activeElement
      : document.activeElement
    : undefined
  ) as any
};
