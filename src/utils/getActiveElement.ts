/**
 * returns active element from document or from shadowdom
 * @returns
 */
export const getActiveElement = (): any => {
  return document.activeElement
    ? document.activeElement.shadowRoot
      ? document.activeElement.shadowRoot.activeElement
      : document.activeElement
    : undefined;
};
